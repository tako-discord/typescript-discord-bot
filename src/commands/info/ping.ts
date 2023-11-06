import { SlashCommandBuilder } from 'discord.js';
import config from '../../../config.ts';
import i18next from '../../i18n.ts';
import { createEmbed, getLanguage, slashCommandTranslator } from '../../util/general.ts';
import type { Command } from '../index.ts';

export default {
	data: new SlashCommandBuilder()
		.setName(i18next.t('ping.name', { ns: 'info' }))
		.setNameLocalizations(slashCommandTranslator('ping.name', 'info'))
		.setDescription(i18next.t('ping.description', { ns: 'info' }))
		.setDescriptionLocalizations(slashCommandTranslator('ping.description', 'info'))
		.toJSON(),
	async execute(interaction) {
		const ping = interaction.client.ws.ping;
		const language = await getLanguage(interaction.guildId);

		const embed = createEmbed({
			color: ping < 200 ? 'green' : ping < 400 ? 'yellow' : 'red',
			title: i18next.t('ping.title', { ns: 'info', lng: language }),
			emoji: config.emojis.ping,
			description: i18next.t('ping.response', { ns: 'info', lng: language, latency: ping }),
		});
		await interaction.reply({ embeds: [embed] });
	},
} satisfies Command;
