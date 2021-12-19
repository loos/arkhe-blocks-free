/**
 * @WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import {
	BlockControls,
	InnerBlocks,
	useBlockProps,
	__experimentalUseInnerBlocksProps as useInnerBlocksProps,
} from '@wordpress/block-editor';

/**
 * @Internal dependencies
 */
import metadata from './block.json';
import blockIcon from './_icon';
import example from './_example';
import { iconColor } from '@blocks/config';
import { ArkheMarginControl } from '@components/ArkheMarginControl';

/**
 * style
 */
import './scss/index.scss';

/**
 * metadata
 */
const blockName = 'ark-block-faq';

/**
 * Q&Aブロック
 */
registerBlockType(metadata.name, {
	title: 'Q&A',
	description: __('Create Q & A format content.', 'arkhe-blocks'),
	icon: {
		foreground: iconColor,
		src: blockIcon,
	},
	example,
	edit: ({ attributes, setAttributes }) => {
		const blockProps = useBlockProps({
			className: `${blockName} ark-has-guide`,
		});
		const innerBlocksProps = useInnerBlocksProps(blockProps, {
			allowedBlocks: ['arkhe-blocks/faq-item'],
			template: [['arkhe-blocks/faq-item'], ['arkhe-blocks/faq-item']],
			templateLock: false,
			renderAppender: InnerBlocks.ButtonBlockAppender,
			// templateInsertUpdatesSelection: true,
		});

		return (
			<>
				<BlockControls>
					<ArkheMarginControl {...{ className: attributes.className, setAttributes }} />
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
