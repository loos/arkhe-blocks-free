/**
 * @WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import {
	RichText,
	InnerBlocks,
	useBlockProps,
	__experimentalUseInnerBlocksProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';

/**
 * @Internal dependencies
 */
import metadata from './block.json';
import blockIcon from './_icon';
import { iconColor } from '@blocks/config';

const compatibleUseInnerBlocksProps =
	typeof useInnerBlocksProps === 'function'
		? useInnerBlocksProps
		: __experimentalUseInnerBlocksProps;

/**
 * metadata
 */
const blockName = 'ark-block-faq';

/**
 * Q&A項目ブロック
 */
registerBlockType(metadata.name, {
	title: __('Q&A item', 'arkhe-blocks'),
	icon: {
		foreground: iconColor,
		src: blockIcon,
	},
	edit: (props) => {
		const { attributes, setAttributes } = props;

		const blockProps = useBlockProps({
			className: `${blockName}__item`,
		});
		const innerBlocksProps = compatibleUseInnerBlocksProps(
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
