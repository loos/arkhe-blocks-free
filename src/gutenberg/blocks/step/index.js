/**
 * @WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useEffect } from '@wordpress/element';
import { registerBlockType } from '@wordpress/blocks';
import {
	InspectorControls,
	BlockControls,
	InnerBlocks,
	useBlockProps,
} from '@wordpress/block-editor';
import { PanelBody, TextControl } from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
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
 * STEPブロック
 */
const blockName = 'ark-block-step';
registerBlockType(metadata.name, {
	title: __('Step', 'arkhe-blocks'),
	description: __('Create step-by-step content.', 'arkhe-blocks'),
	icon: {
		foreground: iconColor,
		src: blockIcon,
	},
	example,
	styles: [
		{ name: 'default', label: __('Default', 'arkhe-blocks'), isDefault: true },
		{ name: 'big', label: __('Big', 'arkhe-blocks') },
		{ name: 'card', label: __('Card', 'arkhe-blocks') },
	],
	edit: ({ attributes, setAttributes, clientId, isSelected }) => {
		const { stepLabel, startNum } = attributes;

		// デフォルトクラスを強制セット
		useEffect(() => {
			if (!attributes.className) {
				setAttributes({ className: 'is-style-default' });
			}
		}, [attributes.className]);

		const { updateBlockAttributes } = useDispatch('core/block-editor');

		// 子ブロックを取得
		const getChildBlocks = useSelect((select) => select('core/block-editor').getBlocks, []);

		// ▼ 5.7から無限ループになる
		// const childBlocks = useSelect((select) => select('core/block-editor').getBlocks(clientId), [clientId]);

		// ブロックProps
		const blockProps = useBlockProps({
			className: `${blockName} ark-has-guide`,
			style: 1 < startNum ? { counterReset: `step ${startNum - 1}` } : null,
		});
		const innerBlocksProps = useInnerBlocksProps(blockProps, {
			allowedBlocks: ['arkhe-blocks/step-item'],
			template: [['arkhe-blocks/step-item'], ['arkhe-blocks/step-item']],
			templateLock: false,
			renderAppender: isSelected ? InnerBlocks.ButtonBlockAppender : false,
		});

		return (
			<>
				<BlockControls>
					<ArkbMarginControl {...{ className: attributes.className, setAttributes }} />
				</BlockControls>
				<InspectorControls>
					<PanelBody title={__('Step settings', 'arkhe-blocks')}>
						<TextControl
							label={__('Text of "STEP" part', 'arkhe-blocks')}
							value={stepLabel}
							onChange={(val) => {
								setAttributes({ stepLabel: val });

								// 子ブロックにも反映
								const childBlocks = getChildBlocks(clientId);
								childBlocks.forEach((block) => {
									updateBlockAttributes(block.clientId, {
										stepLabel: val,
									});
								});
							}}
						/>
						<TextControl
							label={__('Start number', 'arkhe-blocks')}
							value={startNum}
							type='number'
							onChange={(val) => {
								// typeがnumberなので、intに変換してから保存！
								setAttributes({ startNum: parseInt(val) });
							}}
						/>
					</PanelBody>
				</InspectorControls>
				<div {...innerBlocksProps} />
			</>
		);
	},

	save: ({ attributes }) => {
		const startNum = parseInt(attributes.startNum);

		const blockProps = useBlockProps.save({
			className: `${blockName}`,
			style: 1 < startNum ? { counterReset: `step ${startNum - 1}` } : null,
		});
		return (
			<div {...blockProps}>
				<InnerBlocks.Content />
			</div>
		);
	},
});
