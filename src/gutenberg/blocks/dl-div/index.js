/**
 * @WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';
import useInnerBlocksProps from '@compatible/useInnerBlocksProps';

/**
 * @Internal dependencies
 */
import { iconColor } from '@blocks/config';
import metadata from './block.json';

/**
 * dl-div ブロック
 */
const blockName = 'ark-block-dl';
registerBlockType(metadata.name, {
	title: __('Side-by-side items', 'arkhe-blocks'), // 横並び項目
	icon: {
		foreground: iconColor,
		src: (
			<svg viewBox='0 0 56 56'>
				<path d='M28,20H7H3v16h4h21h25V20H28z M51,34H28V22h23V34z' />
			</svg>
		),
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
