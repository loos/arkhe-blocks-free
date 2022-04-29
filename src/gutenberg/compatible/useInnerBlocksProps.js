import { __experimentalUseInnerBlocksProps, useInnerBlocksProps } from '@wordpress/block-editor';

/**
 * export useInnerBlocksProps
 */
const compatibleUseInnerBlocksProps =
	typeof useInnerBlocksProps === 'function'
		? useInnerBlocksProps
		: __experimentalUseInnerBlocksProps;

export default compatibleUseInnerBlocksProps;
