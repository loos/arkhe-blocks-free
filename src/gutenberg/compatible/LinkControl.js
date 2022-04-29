import { LinkControl, __experimentalLinkControl } from '@wordpress/block-editor';

/**
 * export LinkControl
 */
const CompatibleLinkControl =
	typeof LinkControl !== 'undefined' ? LinkControl : __experimentalLinkControl;

export default CompatibleLinkControl;
