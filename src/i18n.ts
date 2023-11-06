import { readdirSync } from 'node:fs';
import i18next from 'i18next';
import type { FsBackendOptions } from 'i18next-fs-backend';
import FsBackend from 'i18next-fs-backend';

await i18next
	.use(FsBackend)
	.init<FsBackendOptions>({
		fallbackLng: 'en',
		returnEmptyString: false,
		backend: {
			loadPath: (import.meta.dir + '/locales/{{lng}}/{{ns}}.json')
		}
	});

const locales = readdirSync(import.meta.dir + '/locales')
const namespaces = readdirSync(import.meta.dir + '/locales/en')
for (const ns of namespaces) {
	namespaces[namespaces.indexOf(ns)] = ns.split('.')[0]
}

await i18next.loadNamespaces(namespaces);
await i18next.loadLanguages(locales);

export { default } from 'i18next';
