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
 * DD ブロック
 */
const blockName = 'ark-block-dl';
registerBlockType(metadata.name, {
	title: __('Description', 'arkhe-blocks'),
	icon: {
		foreground: iconColor,
		src: (
			<svg viewBox='0 0 56 56'>
				<rect x='13' y='29.5' width='36' height='2' />
				<rect x='13' y='24.5' width='36' height='2' />
			</svg>
		),
	},
	edit: () => {
		const blockProps = useBlockProps({
			className: `${blockName}__dd ark-keep-mt--s`,
		});
		const innerBlocksProps = useInnerBlocksProps(blockProps, {
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
