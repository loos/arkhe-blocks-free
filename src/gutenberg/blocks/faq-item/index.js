/**
 * @WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import { RichText, InnerBlocks, useBlockProps } from '@wordpress/block-editor';
import useInnerBlocksProps from '@compatible/useInnerBlocksProps';

/**
 * @Internal dependencies
 */
import metadata from './block.json';
import blockIcon from './icon';
import { iconColor } from '@blocks/config';

/**
 * Q&A項目ブロック
 */
const blockName = 'ark-block-faq';
registerBlockType(metadata.name, {
	title: __('Q&A item', 'arkhe-blocks'),
	icon: {
		foreground: iconColor,
		src: blockIcon,
	},
	edit: ({ attributes, setAttributes }) => {
		const blockProps = useBlockProps({
			className: `${blockName}__item`,
		});
		const innerBlocksProps = useInnerBlocksProps(
			{
				className: `${blockName}__a ark-keep-mt--s`,
			},
			{
				template: [['core/paragraph']],
				templateLock: false,
			}
		);

		return (
			<div {...blockProps}>
				<RichText
					className={`${blockName}__q`}
					tagName='div'
					placeholder={__('Enter text', 'arkhe-blocks') + '...'}
					value={attributes.textQ}
					onChange={(textQ) => setAttributes({ textQ })}
				/>
				<div {...innerBlocksProps} />
			</div>
		);
	},
	save: ({ attributes }) => {
		const blockProps = useBlockProps.save({
			className: `${blockName}__item`,
		});

		return (
			<div {...blockProps}>
				<RichText.Content
					tagName='dt'
					className={`${blockName}__q`}
					value={attributes.textQ}
				/>
				<dd className={`${blockName}__a ark-keep-mt--s`}>
					<InnerBlocks.Content />
				</dd>
			</div>
		);
	},
});
