import { getSettings, __experimentalGetSettings } from '@wordpress/date';

/**
 * export getSettings
 */
const compatibleGetSettings =
	typeof getSettings === 'function' ? getSettings : __experimentalGetSettings;

export default compatibleGetSettings;
