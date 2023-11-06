import type { resources, defaultNS, fallbackNS } from '../i18n';

declare module 'i18next' {
	type CustomTypeOptions = {
		defaultNS: typeof defaultNS;
		fallbackNS: typeof fallbackNS;
		resources: typeof resources;
	};
}
