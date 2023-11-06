const config = {
	// Activates dev mode, which will only sync commands to the dev guild and will log debug logs
	dev: true,
	// Main guild is currently unused, while the dev guild is used for syncing commands just with the guild
	guilds: {
		main: '884046271176912917',
		dev: '884046271176912917',
	},
	// The devs of the bot, used for dev only commands. Input the IDs of the devs here in a string.
	devs: [''],
	colors: {
		primary: 0x299ba3,
		accent: 0x5bd79d,
		green: 0x40b056,
		yellow: 0xf0e34c,
		red: 0xea4d4d,
	},
	emojis: {
		ping: '🏓',
		success: '✅',
		error: '❌',
		pagination: {
			first: '⏮️',
			previous: '◀️',
			next: '▶️',
			last: '⏭️',
		},
	} as const,
	// It's recommended to store API URLs in here, so you can easily change them later
	apis: {
	},
};

export default config;
