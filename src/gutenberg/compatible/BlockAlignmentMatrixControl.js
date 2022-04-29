import {
	BlockAlignmentMatrixControl,
	__experimentalBlockAlignmentMatrixToolbar,
	__experimentalBlockAlignmentMatrixControl,
} from '@wordpress/block-editor';

/**
 * export BlockAlignmentMatrixControl
 */
const compatibleBlockAlignmentMatrixControl =
	typeof BlockAlignmentMatrixControl === 'function'
		? BlockAlignmentMatrixControl
		: __experimentalBlockAlignmentMatrixControl || __experimentalBlockAlignmentMatrixToolbar;

export default compatibleBlockAlignmentMatrixControl;
