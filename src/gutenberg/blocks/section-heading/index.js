/**
 * @WordPress dependencies
 */
// https://github.com/WordPress/gutenberg/blob/master/packages/block-editor/src/components/rich-text/README.md
import { __ } from '@wordpress/i18n';
import { createBlock, registerBlockType } from '@wordpress/blocks';
import { useCallback } from '@wordpress/element';
// import { useSelect } from '@wordpress/data';
import {
	BlockControls,
	RichText,
	AlignmentToolbar,
	InspectorControls,
	useBlockProps,
	PanelColorSettings,
} from '@wordpress/block-editor';
import { PanelBody, RadioControl, ToggleControl, ToolbarGroup } from '@wordpress/components';

/**
 * @Internal dependencies
 */
import { iconColor } from '@blocks/config';
import metadata from './block.json';
import blockIcon from './icon';
import HeadingLevelDropdown from './components/heading-level-dropdown';
import ArkbMarginControl from '@components/ArkbMarginControl';

/**
 * @others dependencies
 */
import classnames from 'classnames';

/**
 * 設定項目
 */
const SUB_POSITIONS = [
	{
		label: __('Top', 'arkhe-blocks'),
		value: 'top',
	},
	{
		label: __('Bottom', 'arkhe-blocks'),
		value: 'bottom',
	},
];

/**
 * registerBlockType
 */
const blockName = 'ark-block-heading';
registerBlockType(metadata.name, {
	title: __('Section Heading', 'arkhe-blocks'),
	icon: {
		foreground: iconColor,
		src: blockIcon,
	},
	transforms: {
		from: [
			//どのブロックタイプから変更できるようにするか
			{
				type: 'block',
				blocks: ['core/paragraph'],
				transform: (attributes) => {
					return createBlock(metadata.name, { content: attributes.content });
				},
			},
		],
	},
	merge(attributes, attributesToMerge) {
		// console.log(attributes, attributesToMerge);
		return {
			content: (attributes.content || '') + (attributesToMerge.content || ''),
		};
	},

	edit: ({ attributes, setAttributes, mergeBlocks, onReplace }) => {
		const { textAlign, content, level, subContent, subPosition, color, lineColor, useLine } =
			attributes;

		// 見出しのタグ
		const tagName = 'h' + level;

		// カラー設定の onChange
		const onColorChange = useCallback(
			(name, newColor) => {
				setAttributes({ [name]: newColor || undefined });
			},
			[setAttributes]
		);

		// ブロックstyle
		const blockStyle = {};
		if (color) {
			blockStyle.color = color;
		}

		// ブロックprops
		const blockProps = useBlockProps({
			className: classnames(`${blockName}`, {
				[`has-text-align-${textAlign}`]: textAlign && 'center' !== textAlign,
				'has-text-color': !!color,
			}),
			'data-sub': subPosition,
			style: blockStyle || null,
		});

		// ラインstyle
		const lineStyle = {};
		if (lineColor) {
			lineStyle.color = lineColor;
		}

		// ラインprops
		const lineProps = {
			className: classnames(`${blockName}__line`, {
				'has-text-color': !!lineColor,
			}),
			style: lineStyle || null,
		};

		// サブテキストprops
		const subtextProps = {
			tagName: 'div',
			className: classnames(`${blockName}__sub`, {
				'is-empty': RichText.isEmpty(subContent),
			}),
			value: subContent,
			onChange: (value) => setAttributes({ subContent: value }),
			placeholder: __('Write sub title…', 'arkhe-blocks'),
			textAlign,
		};

		return (
			<>
				<BlockControls>
					<ToolbarGroup>
						<HeadingLevelDropdown
							selectedLevel={level}
							onChange={(newLevel) => setAttributes({ level: newLevel })}
						/>
					</ToolbarGroup>
					<AlignmentToolbar
						value={textAlign || 'center'}
						onChange={(nextAlign) => {
							setAttributes({ textAlign: nextAlign });
						}}
					/>
					<ArkbMarginControl attributes={attributes} setAttributes={setAttributes} />
				</BlockControls>
				<InspectorControls>
					<PanelBody title={__('Settings', 'arkhe-blocks')} initialOpen={true}>
						<RadioControl
							label={__('Subtext position', 'arkhe-blocks')}
							selected={subPosition}
							options={SUB_POSITIONS}
							onChange={(val) => {
								setAttributes({ subPosition: val });
							}}
						/>
						<ToggleControl
							label={__('Show line', 'arkhe-blocks')}
							checked={useLine}
							onChange={(value) => {
								setAttributes({ useLine: value });
							}}
						/>
					</PanelBody>
					<PanelColorSettings
						title={__('Color settings', 'arkhe-blocks')}
						initialOpen={true}
						colorSettings={[
							{
								value: color,
								label: __('Text Color', 'arkhe-blocks'),
								onChange: (newColor) => {
									onColorChange('color', newColor);
								},
							},
							{
								value: lineColor,
								label: __('Line Color', 'arkhe-blocks'),
								onChange: (newColor) => {
									onColorChange('lineColor', newColor);
								},
							},
						]}
					></PanelColorSettings>
				</InspectorControls>
				<div {...blockProps}>
					{'top' === subPosition && <RichText {...subtextProps} />}
					<RichText
						identifier='content'
						tagName={tagName}
						className={`${blockName}__main`}
						value={content}
						onChange={(value) => setAttributes({ content: value })}
						onMerge={mergeBlocks}
						onSplit={(value) => {
							if (!value) {
								return createBlock('core/paragraph');
							}
							return createBlock(metadata.name, {
								...attributes,
								content: value,
							});
						}}
						onReplace={onReplace}
						onRemove={() => onReplace([])}
						placeholder={__('Write heading…')}
						textAlign={textAlign}
					/>
					{useLine && <span {...lineProps}></span>}
					{'bottom' === subPosition && <RichText {...subtextProps} />}
				</div>
			</>
		);
	},

	save: ({ attributes }) => {
		const { textAlign, content, level, subContent, subPosition, useLine, color, lineColor } =
			attributes;

		// 見出しタグ
		const TagName = 'h' + level;

		// ブロックstyle
		const blockStyle = {};
		if (color) {
			blockStyle.color = color;
		}

		// ブロックprops
		const blockProps = useBlockProps.save({
			className: classnames(`${blockName}`, {
				[`has-text-align-${textAlign}`]: textAlign && 'center' !== textAlign,
				'has-text-color': !!color,
			}),
			'data-sub': subPosition,
			style: blockStyle || null,
		});

		// ラインstyle
		const lineStyle = {};
		if (lineColor) {
			lineStyle.color = lineColor;
		}

		return (
			<div {...blockProps}>
				{'top' === subPosition && (
					<div className={`${blockName}__sub`}>
						<RichText.Content value={subContent} />
					</div>
				)}
				<TagName className={`${blockName}__main`}>
					<RichText.Content value={content} />
				</TagName>
				{useLine && (
					<span
						className={classnames(`${blockName}__line`, {
							'has-text-color': !!lineColor,
						})}
						style={lineStyle || null}
					></span>
				)}
				{'bottom' === subPosition && (
					<div className={`${blockName}__sub`}>
						<RichText.Content value={subContent} />
					</div>
				)}
			</div>
		);
	},
});
