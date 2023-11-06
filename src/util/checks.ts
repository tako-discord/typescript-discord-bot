import config from '../../config.ts';

export function isDev(id: string) {
	return config.devs.includes(id);
}
