/**
 * @WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import {
	InnerBlocks,
	useBlockProps,
	__experimentalUseInnerBlocksProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';

/**
 * @Internal dependencies
 */
import { iconColor } from '@blocks/config';
import blockIcon from './_icon';
import metadata from './block.json';

const compatibleUseInnerBlocksProps =
	typeof useInnerBlocksProps === 'function'
		? useInnerBlocksProps
		: __experimentalUseInnerBlocksProps;

/**
 * metadata
 */
const blockName = 'ark-block-dl';

/**
 * DD ブロック
 */
registerBlockType(metadata.name, {
	title: __('Description', 'arkhe-blocks'),
	icon: {
		foreground: iconColor,
		src: blockIcon,
	},
	edit: () => {
		const blockProps = useBlockProps({
			className: `${blockName}__dd ark-keep-mt--s`,
		});
		const innerBlocksProps = compatibleUseInnerBlocksProps(blockProps, {
			template: [['core/paragraph']],
			templateLock: false,
		});

		return <div {...innerBlocksProps} />;
	},
	save: () => {
		const blockProps = useBlockProps.save({
			className: `${blockName}__dd ark-keep-mt--s`,
		});

		return (
			<dd {...blockProps}>
				<InnerBlocks.Content />
			</dd>
		);
	},
});
