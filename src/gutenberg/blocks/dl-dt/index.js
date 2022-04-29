/**
 * @WordPress dependencies
 */
import { __, _x } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import { RichText, useBlockProps } from '@wordpress/block-editor';

/**
 * @Internal dependencies
 */
import { iconColor } from '@blocks/config';
import metadata from './block.json';

/**
 * DT ブロック
 */
const blockName = 'ark-block-dl';
registerBlockType(metadata.name, {
	title: _x('Term', 'block-name', 'arkhe-blocks'),
	icon: {
		foreground: iconColor,
		src: (
			<svg viewBox='0 0 56 56'>
				<rect x='13' y='26' width='36' height='4' />
				<rect x='7' y='26' width='2' height='4' />
			</svg>
		),
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
