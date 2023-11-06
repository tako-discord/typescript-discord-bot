import type { ChatInputCommandInteraction } from 'discord.js';
import { PermissionsBitField, SlashCommandBuilder } from 'discord.js';
import { isLangCode } from 'is-language-code';
import config from '../../../config.ts';
import { languages } from '../../@types/utility.ts';
import prisma from '../../database.ts';
import i18next from '../../i18n.ts';
import { createEmbed, getLanguage, slashCommandTranslator } from '../../util/general.ts';
import type { Command } from '../index.ts';

async function logic(
	interaction: ChatInputCommandInteraction,
	language: string,
	responseLanguage: string,
	personal: boolean,
) {
	if (!personal && !interaction.guildId) {
		const invalidLanguage = createEmbed({
			color: 'red',
			title: i18next.t('serverRequired.title', { ns: 'errors', lng: responseLanguage }),
			description: i18next.t('serverRequired.description', { ns: 'errors', lng: responseLanguage }),
			emoji: config.emojis.error,
		});
		await interaction.reply({ embeds: [invalidLanguage], ephemeral: true });
		return;
	}

	if (!isLangCode(language).res) {
		const invalidLanguage = createEmbed({
			color: 'red',
			title: i18next.t('language.invalidLanguage.title', { ns: 'errors', lng: responseLanguage }),
			description: i18next.t('language.invalidLanguage.description', { ns: 'errors', lng: responseLanguage }),
			emoji: config.emojis.error,
		});
		await interaction.reply({ embeds: [invalidLanguage], ephemeral: true });
		return;
	}

	if (!personal && interaction.guildId) {
		await prisma.guild.upsert({
			where: { id: interaction.guildId },
			create: { id: interaction.guildId, language },
			update: { language },
		});
	} else if (personal) {
		await prisma.user.upsert({
			where: { id: interaction.user.id },
			create: { id: interaction.user.id, language },
			update: { language },
		});
	}

	const success = createEmbed({
		color: 'green',
		title: i18next.t('changeLanguage.response', { ns: 'utility', language }),
		emoji: config.emojis.success,
	});

	await interaction.reply({ embeds: [success], ephemeral: true });
}

export default {
	data: new SlashCommandBuilder()
		.setName(i18next.t('changeLanguage.name', { ns: 'utility' }))
		.setNameLocalizations(slashCommandTranslator('changeLanguage.name', 'utility'))
		.setDescription(i18next.t('changeLanguage.description', { ns: 'utility' }))
		.setDescriptionLocalizations(slashCommandTranslator('changeLanguage.description', 'utility'))
		.addSubcommand((subcommand) =>
			subcommand
				.setName(i18next.t('changeLanguage.personal.name', { ns: 'utility' }))
				.setNameLocalizations(slashCommandTranslator('changeLanguage.personal.name', 'utility'))
				.setDescription(i18next.t('changeLanguage.personal.description', { ns: 'utility' }))
				.setDescriptionLocalizations(slashCommandTranslator('changeLanguage.personal.description', 'utility'))
				.addStringOption((option) =>
					option
						.setName(i18next.t('changeLanguage.options.language.name', { ns: 'utility' }))
						.setNameLocalizations(slashCommandTranslator('changeLanguage.options.language.name', 'utility'))
						.setDescription(i18next.t('changeLanguage.options.language.description', { ns: 'utility' }))
						.setDescriptionLocalizations(
							slashCommandTranslator('changeLanguage.options.language.description', 'utility'),
						)
						.setAutocomplete(true)
						.setRequired(true),
				),
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName(i18next.t('changeLanguage.server.name', { ns: 'utility' }))
				.setNameLocalizations(slashCommandTranslator('changeLanguage.server.name', 'utility'))
				.setDescription(i18next.t('changeLanguage.server.description', { ns: 'utility' }))
				.setDescriptionLocalizations(slashCommandTranslator('changeLanguage.server.description', 'utility'))
				.addStringOption((option) =>
					option
						.setName(i18next.t('changeLanguage.options.language.name', { ns: 'utility' }))
						.setNameLocalizations(slashCommandTranslator('changeLanguage.options.language.name', 'utility'))
						.setDescription(i18next.t('changeLanguage.options.language.description', { ns: 'utility' }))
						.setDescriptionLocalizations(
							slashCommandTranslator('changeLanguage.options.language.description', 'utility'),
						)
						.setAutocomplete(true)
						.setRequired(true),
				),
		)
		.setDefaultMemberPermissions(PermissionsBitField.Flags.ManageGuild)
		.toJSON(),
	async execute(interaction: ChatInputCommandInteraction) {
		const subcommand = interaction.options.getSubcommand();
		const language =
			interaction.options.getString(i18next.t('changeLanguage.options.language.name', { ns: 'utility' })) ?? 'en';
		const responseLanguage = await getLanguage(
			interaction.guildId,
			subcommand === i18next.t('changeLanguage.personal.name', { ns: 'utility' }) ? interaction.user.id : undefined,
		);

		if (subcommand === i18next.t('changeLanguage.server.name', { ns: 'utility' })) {
			await logic(interaction, language, responseLanguage, false);
		} else {
			await logic(interaction, language, responseLanguage, true);
		}
	},
	async autocomplete(interaction) {
		const focusedValue = interaction.options.getFocused();
		const filtered = [];
		for (const key in languages) {
			if (Object.hasOwn(languages, key)) {
				// @ts-expect-error This value cannot be undefined, because the key is directly from the object.
				const value: string = languages[key];
				if (
					value.toLowerCase().includes(focusedValue.toLowerCase()) ||
					key.toLowerCase().includes(focusedValue.toLowerCase())
				) {
					filtered.push({ name: value, value: key });
				}
			}
		}

		const limited = filtered.slice(0, 25);
		await interaction.respond(limited);
	},
} satisfies Command;
