/**
 * @WordPress dependencies
 */
import { RichText, InnerBlocks, useBlockProps } from '@wordpress/block-editor';

/**
 * @Internal dependencies
 */
import { ArkheIcon } from '@components/deprecated/ArkheIcon';

/**
 * deprecated
 */
const blockName = 'ark-block-timeline';
export default [
	{
		// アイコンピッカーリニューアル前の width,height がない時（faアイコンのときはカバーできない）
		supports: { anchor: true, className: false, reusable: false },
		attributes: {
			title: {
				type: 'string',
				source: 'html',
				selector: '.ark-block-timeline__title',
			},
			label: {
				type: 'string',
				source: 'html',
				selector: '.ark-block-timeline__label',
			},
			isFill: {
				type: 'boolean',
				default: false,
			},
			icon: {
				type: 'string',
				default: '',
			},
			color: {
				type: 'string',
				default: '',
			},
		},
		save: ({ attributes }) => {
			const { title, label, isFill, icon, color } = attributes;

			let shapeClass = `${blockName}__shape`;
			if (isFill) {
				shapeClass += ' -is-fill';
			}
			if (icon) {
				shapeClass += ' -has-icon';
			}

			const shapeStyle = color ? { color } : null;

			const blockProps = useBlockProps.save({
				className: `${blockName}__item`,
			});

			return (
				<div {...blockProps}>
					<div className={`${blockName}__head`}>
						<span className={shapeClass} role='presentation' style={shapeStyle}>
							<ArkheIcon icon={icon} className={`${blockName}__icon`} />
						</span>
						<span className={`${blockName}__label`}>
							<RichText.Content value={label} />
						</span>
					</div>
					<div className={`${blockName}__title`}>
						<RichText.Content value={title} />
					</div>
					<div className={`${blockName}__body ark-keep-mt--s`}>
						<InnerBlocks.Content />
					</div>
				</div>
			);
		},
	},
];
