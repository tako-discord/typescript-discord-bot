import type { APIEmbedField, EmbedAuthorOptions, EmbedFooterOptions } from 'discord.js';
import config from '../../config.ts';

const emojis = config.emojis;
type baseEmojis = Exclude<keyof typeof config.emojis, 'pagination'>;
type paginationEmojis = keyof (typeof config.emojis)['pagination'];

export type EmbedOptions = {
	author?: EmbedAuthorOptions;
	color: number | keyof typeof config.colors;
	description?: string;
	emoji?: (typeof config.emojis.pagination)[paginationEmojis] | (typeof config.emojis)[baseEmojis];
	fields?: APIEmbedField[];
	footer?: EmbedFooterOptions | null | undefined;
	image?: string | null;
	thumbnail?: string;
	timestamp?: Date | number | null | undefined;
	title?: string;
};
