/**
 * @WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import { BlockControls, InnerBlocks, useBlockProps } from '@wordpress/block-editor';
import useInnerBlocksProps from '@compatible/useInnerBlocksProps';

/**
 * @Internal dependencies
 */
import { iconColor } from '@blocks/config';
import metadata from './block.json';
import blockIcon from './icon';
import example from './_example';
import ArkbMarginControl from '@components/ArkbMarginControl';

/**
 * Register Block
 */
const blockName = 'ark-block-timeline';
registerBlockType(metadata.name, {
	title: __('Timeline', 'arkhe-blocks'),
	description: __('Create timeline format content.', 'arkhe-blocks'),
	icon: {
		foreground: iconColor,
		src: blockIcon,
	},
	example,
	edit: ({ attributes, setAttributes, isSelected }) => {
		const blockProps = useBlockProps({
			className: `${blockName} ark-has-guide`,
		});
		const innerBlocksProps = useInnerBlocksProps(blockProps, {
			allowedBlocks: ['arkhe-blocks/timeline-item'],
			template: [['arkhe-blocks/timeline-item'], ['arkhe-blocks/timeline-item']],
			templateLock: false,
			renderAppender: isSelected ? InnerBlocks.ButtonBlockAppender : false,
		});

		return (
			<>
				<BlockControls>
					<ArkbMarginControl {...{ className: attributes.className, setAttributes }} />
				</BlockControls>
				<div {...innerBlocksProps} />
			</>
		);
	},

	save: () => {
		const blockProps = useBlockProps.save({
			className: `${blockName}`,
		});

		return (
			<div {...blockProps}>
				<InnerBlocks.Content />
			</div>
		);
	},
});
