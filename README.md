# TypeScript Discord Bot Template

This is a template for creating a Discord bot using TypeScript and the Bun framework. Please note that the documentation isn't really written yet and you should come with some technical knowledge about the tech used here or at least know how to read their documentations.

## Prerequisites
- [Bun](https://bun.sh)
- A database compatible with [Prisma](https://prisma.io). The schema file is currently set for [PostgreSQL](https://www.postgresql.org/).

## Getting Started

1. Clone this repository.
2. Install dependencies with `bun install`.
3. Create a `.env` file with your Discord bot token and any other necessary configuration variables as outlined in `.env.example`
4. If you want automatic uploads and downloads to Crowdin, check out `.github/workflows/crowdin.yml`!

## Database
You can just import `prisma` from `src/database.ts` to get access to the fully typesafe database.

## Translation
Import `i18next` from `src/i18n.ts` to get an i18next object that is already fully equipped with all the translations in `src/locales`. It's recommended to use the *i18n Ally* extension by Lokalise for a nice integration into VS Code, in order to check if your translations exist.

## Scripts
You can run these scripts by using `bun run ` as a prefix.

`commit`: Commit your changes using commitizen

`format`: Lint and attempt to autofix all your files. It's recommended to use a Prettier ESLint Plugin for your Editor or to create a GitHub Workflow or similiar to lint everything.

`deploy`: Deploy/Sync the application commands (Slash-Commands) if the regular sync command does not work.

`start`: Start the bot.

`dev`: Start the bot with hot-reloading on file changes.

## Features

- Bun instead of Node for way faster code execution
- TypeScript support, to prevent errors before going into production
- Reliable translation with i18next and Crowdin Support
- Consistency using custom helpers and a robust configuration system.

## To-Do
- [ ] Better logging
- [ ] Documentation for a foolproof setup

## Contributing

Contributions are welcome! Please open an issue or pull request for any requests, changes or additions.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
