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
 * アコーディオン
 */
const blockName = 'ark-block-accordion';
registerBlockType(metadata.name, {
	title: __('Accordion', 'arkhe-blocks'),
	description: __('Create content that can be expanded with a click.', 'arkhe-blocks'),
	icon: {
		foreground: iconColor,
		src: blockIcon,
	},
	// providesContext :{
	//     "arkhe-block/accordion/iconOpened": "iconOpened",
	//     "arkhe-block/accordion/iconClosed": "iconClosed"
	// },
	example,
	edit: ({ attributes, setAttributes, isSelected }) => {
		const blockProps = useBlockProps({
			className: `${blockName} ark-has-guide`,
		});
		const innerBlocksProps = useInnerBlocksProps(blockProps, {
			allowedBlocks: ['arkhe-blocks/accordion-item'],
			template: [['arkhe-blocks/accordion-item'], ['arkhe-blocks/accordion-item']],
			templateLock: false,
			renderAppender: isSelected ? InnerBlocks.ButtonBlockAppender : false,
		});

		return (
			<>
				<BlockControls>
					<ArkbMarginControl attributes={attributes} setAttributes={setAttributes} />
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
			<div {...blockProps}>
				<InnerBlocks.Content />
			</div>
		);
	},
});
