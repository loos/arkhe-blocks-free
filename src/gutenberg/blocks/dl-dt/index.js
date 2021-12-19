/**
 * @WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import { RichText, useBlockProps } from '@wordpress/block-editor';

/**
 * @Internal dependencies
 */
import { iconColor } from '@blocks/config';
import blockIcon from './_icon';
import metadata from './block.json';

/**
 * metadata
 */
const blockName = 'ark-block-dl';

/**
 * DT ブロック
 */
registerBlockType(metadata.name, {
	title: __('Term', 'arkhe-blocks'),
	icon: {
		foreground: iconColor,
		src: blockIcon,
	},
	edit: (props) => {
		const { attributes, setAttributes } = props;
		const blockProps = useBlockProps({
			className: `${blockName}__dt`,
		});

		return (
			<div {...blockProps}>
				<RichText
					tagName='span'
					placeholder={__('Enter text', 'arkhe-blocks') + '...'}
					value={attributes.content}
					onChange={(content) => setAttributes({ content })}
				/>
			</div>
		);
	},
	save: ({ attributes }) => {
		const blockProps = useBlockProps.save({
			className: `${blockName}__dt`,
		});
		return (
			<dt {...blockProps}>
				<RichText.Content tagName='span' value={attributes.content} />
			</dt>
		);
	},
});
