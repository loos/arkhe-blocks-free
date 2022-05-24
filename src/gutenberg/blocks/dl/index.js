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
import example from './_example';
import blockIcon from './icon';
import ArkbMarginControl from '@components/ArkbMarginControl';

/**
 * registerBlockType
 */
const blockName = 'ark-block-dl';
registerBlockType(metadata.name, {
	title: __('Description list', 'arkhe-blocks'),
	description: __('Create a description list using the "dl" tag.', 'arkhe-blocks'),
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
			allowedBlocks: ['arkhe-blocks/dl-div', 'arkhe-blocks/dl-dt', 'arkhe-blocks/dl-dd'],
			template: [
				['arkhe-blocks/dl-dt'],
				['arkhe-blocks/dl-dd'],
				['arkhe-blocks/dl-dt'],
				['arkhe-blocks/dl-dd'],
			],
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
			className: blockName,
		});
		return (
			<dl {...blockProps}>
				<InnerBlocks.Content />
			</dl>
		);
	},
});
