/**
 * @WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import {
	InnerBlocks,
	useBlockProps,
	__experimentalUseInnerBlocksProps as useInnerBlocksProps,
} from '@wordpress/block-editor';

/**
 * @Internal dependencies
 */
import { iconColor } from '@blocks/config';
import blockIcon from './_icon';
import metadata from './block.json';

/**
 * @Others dependencies
 */
// import classnames from 'classnames';

/**
 * metadata
 */
const blockName = 'ark-block-dl';

/**
 * DD ブロック
 */
registerBlockType(metadata.name, {
	title: __('Side-by-side items', 'arkhe-blocks'), // 横並び項目
	icon: {
		foreground: iconColor,
		src: blockIcon,
	},
	edit: () => {
		const blockProps = useBlockProps({
			className: `${blockName}__div`,
		});
		const innerBlocksProps = useInnerBlocksProps(blockProps, {
			allowedBlocks: ['arkhe-blocks/dl-dt', 'arkhe-blocks/dl-dd'],
			template: [['arkhe-blocks/dl-dt'], ['arkhe-blocks/dl-dd']],
			templateLock: 'all',
		});

		return <div {...innerBlocksProps} />;
	},
	save: () => {
		const blockProps = useBlockProps.save({
			className: `${blockName}__div`,
		});

		return (
			<div {...blockProps}>
				<InnerBlocks.Content />
			</div>
		);
	},
});
