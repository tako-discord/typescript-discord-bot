import { readdir } from 'node:fs/promises';
import { URL } from 'node:url';
import { Client, GatewayIntentBits } from 'discord.js';
import { loadCommands, loadEvents } from './util/loaders.ts';
import { registerEvents } from './util/registerEvents.ts';

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const commandArray = [];
for (const dir of (await readdir(`${import.meta.dir}/commands`, { withFileTypes: true }))
	.filter((dirent) => dirent.isDirectory())
	.map((dirent) => dirent.name)) {
	commandArray.push(await loadCommands(Bun.pathToFileURL(`${import.meta.dir}/commands/${dir}`)));
}

const commands = new Map();
for (const cmd of commandArray) {
	for (const [key, value] of cmd) {
		commands.set(key, value);
	}
}

const events = await loadEvents(new URL('events/', import.meta.url));
registerEvents(client, commands, events);

void client.login(Bun.env.DISCORD_TOKEN);
