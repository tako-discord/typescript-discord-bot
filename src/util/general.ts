import type { Client } from 'discord.js';
import { EmbedBuilder, Locale } from 'discord.js';
import config from '../../config.ts';
import type { EmbedOptions } from '../@types/general';
import prisma from '../database.ts';
import i18next from '../i18n.ts';

export function createEmbed({
	author,
	color = 'primary',
	description,
	emoji,
	fields,
	footer,
	image,
	thumbnail,
	timestamp,
	title,
}: EmbedOptions) {
	const embedTitle = emoji ? `${emoji} ${title ?? ''}` : title;
	const embed = new EmbedBuilder().setColor(typeof color === 'string' ? config.colors[color] : color);

	if (embedTitle) embed.setTitle(embedTitle);
	if (description) embed.setDescription(description);
	if (fields) embed.setFields(fields);
	if (thumbnail) embed.setThumbnail(thumbnail);
	if (image) embed.setImage(image);
	if (timestamp) embed.setTimestamp(timestamp);
	if (footer) embed.setFooter(footer);
	if (author) embed.setAuthor(author);

	return embed;
}

export async function getColor(guildId: string | null, userId?: string, client?: Client) {
	let color = config.colors.primary;
	if (guildId) {
		const guild = await prisma.guild.findFirst({ where: { id: guildId } });
		if (guild?.color) color = guild.color;
	}

	if (userId) {
		const user = await prisma.user.findFirst({ where: { id: userId } });

		if (!user?.color && client) {
			const user = await client.users.fetch(userId, { force: true });
			if (user) color = user.accentColor ?? color;
			return color;
		}

		color = user?.color ?? color;
	}

	return color;
}

export async function getLanguage(guildId: string | null, userId?: string, prioritizeGuild = false) {
	let language = 'en';
	let guildAvailable = false;
	if (guildId) {
		const guild = await prisma.guild.findFirst({ where: { id: guildId } });
		if (guild?.language) language = guild.language;
		if (guild?.language && prioritizeGuild) guildAvailable = true;
	}

	if (userId && !guildAvailable) {
		const user = await prisma.user.findFirst({ where: { id: userId } });
		if (user?.language) language = user.language;
	}

	return language;
}

export function slashCommandTranslator(key: string, ns: string) {
	const translation: { [index: string]: string } = {};
	const locales = Object.values(Locale);

	for (const locale of locales) {
		translation[locale] = i18next.t(key, { ns, lng: locale });
	}

	return translation;
}
