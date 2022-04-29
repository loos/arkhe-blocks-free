import {
	FullHeightAlignmentControl,
	__experimentalBlockFullHeightAligmentControl, // memo: スペルミスはそのうち修正されそう
} from '@wordpress/block-editor';

/**
 * export useInnerBlocksProps
 */
const compatibleFullHeightAlignmentControl =
	typeof FullHeightAlignmentControl === 'function'
		? FullHeightAlignmentControl
		: __experimentalBlockFullHeightAligmentControl;

export default compatibleFullHeightAlignmentControl;
