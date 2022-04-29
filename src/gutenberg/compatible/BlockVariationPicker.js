import { BlockVariationPicker, __experimentalBlockVariationPicker } from '@wordpress/block-editor';

/**
 * export BlockAlignmentMatrixControl
 */
const compatibleBlockVariationPicker =
	typeof BlockVariationPicker === 'function'
		? BlockVariationPicker
		: __experimentalBlockVariationPicker;

export default compatibleBlockVariationPicker;
