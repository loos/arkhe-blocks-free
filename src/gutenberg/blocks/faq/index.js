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
 * Q&Aブロック
 */
const blockName = 'ark-block-faq';
registerBlockType(metadata.name, {
	title: 'Q&A',
	description: __('Create Q & A format content.', 'arkhe-blocks'),
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
			allowedBlocks: ['arkhe-blocks/faq-item'],
			template: [['arkhe-blocks/faq-item'], ['arkhe-blocks/faq-item']],
			templateLock: false,
			renderAppender: isSelected ? InnerBlocks.ButtonBlockAppender : false,
			// templateInsertUpdatesSelection: true,
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
