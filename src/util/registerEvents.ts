import { Events, type Client } from 'discord.js';
import type { Command } from '../commands/index.ts';
import type { Event } from '../events/index.ts';

export function registerEvents(client: Client, commands?: Map<string, Command>, events?: Event[]): void {
	if (commands) {
		const interactionCreateEvent: Event<Events.InteractionCreate> = {
			name: Events.InteractionCreate,
			async execute(interaction) {
				if (interaction.isCommand() || interaction.isContextMenuCommand()) {
					const command = commands.get(interaction.commandName);

					if (!command) {
						throw new Error(`Command '${interaction.commandName}' not found.`);
					}

					await command.execute(interaction);
				}

				if (interaction.isAutocomplete()) {
					const command = commands.get(interaction.commandName);

					if (!command?.autocomplete) {
						throw new Error(`Command '${interaction.commandName}' not found.`);
					}

					await command.autocomplete(interaction);
				}

				if (interaction.isModalSubmit()) {
					const command = commands.get(interaction.customId);

					if (!command?.modalSubmit) {
						throw new Error(`Command '${interaction.customId}' not found.`);
					}

					await command.modalSubmit(interaction);
				}
			},
		};

		client[interactionCreateEvent.once ? 'once' : 'on'](interactionCreateEvent.name, async (...args) =>
			interactionCreateEvent.execute(...args),
		);
	}

	if (events) {
		for (const event of events) {
			client[event.once ? 'once' : 'on'](event.name, async (...args) => event.execute(...args));
		}
	}
}
