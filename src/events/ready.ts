import { setInterval } from 'node:timers';
import { ActivityType, Events } from 'discord.js';
import { logger } from '../util/logger.ts';
import type { Event } from './index.ts';

export default {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
		logger.info(`Ready! Logged in as ${client.user.tag}`);

		setInterval(() => {
			const activities = [
				{ activity: `with version ${Bun.env.npm_package_version}`, type: ActivityType.Playing },
				{ activity: `/ Commands`, type: ActivityType.Listening },
				{
					activity: `${client.users.cache.size} user${client.users.cache.size > 1 ? 's' : ''}`,
					type: ActivityType.Listening,
				},
				{
					activity: `over ${client.guilds.cache.size} server${client.guilds.cache.size > 1 ? 's' : ''}`,
					type: ActivityType.Watching,
				},
			];

			const randomIndex = Math.floor(Math.random() * activities.length);

			client.user.setActivity(activities[randomIndex].activity, { type: activities[randomIndex].type });
		}, 7_500);
	},
} satisfies Event<'ready'>;
