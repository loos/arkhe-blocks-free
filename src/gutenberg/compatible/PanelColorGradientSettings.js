import {
	PanelColorGradientSettings,
	__experimentalPanelColorGradientSettings,
} from '@wordpress/block-editor';

/**
 * export PanelColorGradientSettings
 */
const CompatiblePanelColorGradientSettings =
	typeof PanelColorGradientSettings !== 'undefined'
		? PanelColorGradientSettings
		: __experimentalPanelColorGradientSettings;

export default CompatiblePanelColorGradientSettings;
