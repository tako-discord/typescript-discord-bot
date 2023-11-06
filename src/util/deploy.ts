import { readdir } from 'node:fs/promises';
import { API } from '@discordjs/core/http-only';
import { REST } from 'discord.js';
import config from '../../config.ts';
import { loadCommands } from './loaders.ts';

const commands = [];
const commandData = [];

for (const dir of (
	await readdir(`${import.meta.dir.slice(0, import.meta.dir.length - 5)}/commands`, { withFileTypes: true })
)
	.filter((dirent) => dirent.isDirectory())
	.map((dirent) => dirent.name)) {
	commands.push(
		await loadCommands(Bun.pathToFileURL(`${import.meta.dir.slice(0, import.meta.dir.length - 5)}/commands/${dir}`)),
	);
}

for (const command of commands) {
	for (const cmd of [...command.values()].map((command) => command.data)) {
		commandData.push(cmd);
	}
}

const rest = new REST({ version: '10' }).setToken(Bun.env.DISCORD_TOKEN!);
const api = new API(rest);

let result;
if (config.dev && config.guilds.dev) {
	result = await api.applicationCommands.bulkOverwriteGuildCommands(
		Bun.env.APPLICATION_ID!,
		config.guilds.dev,
		commandData,
	);
} else {
	result = await api.applicationCommands.bulkOverwriteGlobalCommands(Bun.env.APPLICATION_ID!, commandData);
	await api.applicationCommands.bulkOverwriteGuildCommands(Bun.env.APPLICATION_ID!, config.guilds.dev!, []);
}

console.info(
	`Successfully registered ${result.length} commands.${config.dev ? ` In the guild ${config.guilds.dev}!` : ''}`,
);
