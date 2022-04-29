/**
 * @WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { createBlock, registerBlockType } from '@wordpress/blocks';
import { useDispatch, useSelect } from '@wordpress/data';
import { useMemo, useEffect, useCallback, RawHTML } from '@wordpress/element';
import {
	BlockControls,
	InspectorControls,
	InnerBlocks,
	useBlockProps,
} from '@wordpress/block-editor';
import { ToolbarButton } from '@wordpress/components';
import useInnerBlocksProps from '@compatible/useInnerBlocksProps';
import BlockAlignmentMatrixControl from '@compatible/BlockAlignmentMatrixControl';
import FullHeightAlignmentControl from '@compatible/FullHeightAlignmentControl';

/**
 * @Internal dependencies
 */
import metadata from './block.json';
import deprecated from './deprecated';
import blockIcon from './icon';
import TheSidebar from './_sidebar';
import BgMedia from './components/BgMedia';
import SectionSVG from './components/SectionSVG';
import ArkbMarginControl from '@components/ArkbMarginControl';
import { getBlockStyle, getColorStyle, getSvgData } from './_helper';
import { DEFAULT_MEDIA_ATTRS } from './config';
import { iconColor } from '@blocks/config';

/**
 * @others dependencies
 */
import classnames from 'classnames';
// import hexToRgba from 'hex-to-rgba';

/**
 * Register Block
 */
const blockName = 'ark-block-section';
registerBlockType(metadata.name, {
	title: __('Section', 'arkhe-blocks'),
	description: __('Create a content area to use as a section.', 'arkhe-blocks'),
	icon: {
		foreground: iconColor,
		src: blockIcon.block,
	},
	transforms: {
		from: [
			//どのブロックタイプから変更できるようにするか
			{
				type: 'block',
				blocks: ['core/group'],
				transform: (attributes, content) => {
					return createBlock(metadata.name, {}, content);
				},
			},
		],
	},
	edit: ({ attributes, setAttributes, isSelected, clientId }) => {
		const {
			align,
			media,
			mediaSP,
			focalPoint,
			focalPointSP,
			isRepeat,
			innerSize,
			height,
			svgTop,
			svgBottom,
			contentPosition,
			filter,
			tag,
		} = attributes;

		// PCメディアがないのにSPメディアのデータがある場合、削除。
		useEffect(() => {
			if (!media.url && !!mediaSP.url) {
				setAttributes({
					mediaSP: DEFAULT_MEDIA_ATTRS,
					focalPointSP: undefined,
				});
			}
		}, []);

		const { updateBlockAttributes } = useDispatch('core/block-editor');
		const getChildBlocks = useSelect((select) => select('core/block-editor').getBlocks, []);

		// クラス名
		const blockClass = classnames(blockName, {
			'has-bg-img': !!media.url,
		});

		// スタイルデータ
		const { blockStyle, colorStyle } = useMemo(() => {
			return {
				blockStyle: getBlockStyle(attributes),
				colorStyle: getColorStyle(attributes),
			};
		}, [attributes]);

		// svgデータ
		const { svgDataTop, svgDataBottom } = useMemo(() => {
			return {
				svgDataTop: getSvgData(svgTop),
				svgDataBottom: getSvgData(svgBottom),
			};
		}, [svgTop, svgBottom]);

		// SVG分のpadding
		if (0 !== svgDataTop.height) {
			blockStyle['--arkb-svg-height--top'] = `${svgDataTop.height}vw`;
		}
		if (0 !== svgDataBottom.height) {
			blockStyle['--arkb-svg-height--bottom'] = `${svgDataBottom.height}vw`;
		}

		// ブロックProps
		const blockProps = useBlockProps({
			className: blockClass,
			style: blockStyle || null,
			'data-height': height || null,
			'data-inner': innerSize || null,
		});

		const innerBlocksProps = useInnerBlocksProps(
			{
				className: `${blockName}__bodyInner ark-keep-mt`,
			},
			{
				template: [['arkhe-blocks/section-heading'], ['core/paragraph']],
				templateLock: false,
			}
		);

		// コンテンツ位置変更処理
		const setPosition = useCallback(
			(nextPosition) => {
				// まだ切り替えてなくてもボタン展開する時に実行されてしまうのでそれを防ぐ
				if (contentPosition === nextPosition) {
					return;
				}
				setAttributes({ contentPosition: nextPosition });

				let textAlign = '';
				if (-1 !== nextPosition.indexOf(' center')) {
					textAlign = 'center';
				} else if (-1 !== nextPosition.indexOf(' right')) {
					textAlign = 'right';
				} else if (-1 !== nextPosition.indexOf(' left')) {
					textAlign = 'left';
				}

				// 子ブロックにも反映
				const childBlocks = getChildBlocks(clientId);
				childBlocks.forEach((block) => {
					if ('arkhe-blocks/section-heading' === block.name && textAlign) {
						updateBlockAttributes(block.clientId, { textAlign });
					}
				});
			},
			[contentPosition]
		);

		const OuterTag = tag || 'div';
		return (
			<>
				<BlockControls group='block'>
					{'full' === align && (
						<>
							<ToolbarButton
								className={classnames('components-toolbar__control', {
									'is-pressed': 'full' === innerSize,
								})}
								label={__('To full-width content', 'arkhe-blocks')}
								icon={blockIcon.fullInner}
								onClick={() => {
									if ('full' !== innerSize) {
										setAttributes({ innerSize: 'full' });
									} else {
										setAttributes({ innerSize: '' });
									}
								}}
							/>
							<BlockAlignmentMatrixControl
								label={__('Change content position')}
								value={contentPosition}
								onChange={setPosition}
							/>
						</>
					)}
					<FullHeightAlignmentControl
						isActive={'full' === height}
						onToggle={() => {
							if ('full' !== height) {
								setAttributes({ height: 'full' });
							} else {
								setAttributes({ height: 'custom' });
							}
						}}
					/>
				</BlockControls>
				<BlockControls>
					<ArkbMarginControl {...{ className: attributes.className, setAttributes }} />
				</BlockControls>
				<InspectorControls>
					<TheSidebar {...{ attributes, setAttributes, isSelected }} />
				</InspectorControls>
				<OuterTag {...blockProps}>
					<BgMedia {...{ media, mediaSP, focalPoint, focalPointSP, isRepeat }} />
					<div className={`${blockName}__color arkb-absLayer`} style={colorStyle}></div>
					{'off' !== filter && (
						<div className={`c-filterLayer -filter-${filter} arkb-absLayer`}></div>
					)}
					<div
						className={`${blockName}__body`}
						data-content={contentPosition.replace(' ', '-')}
					>
						<div {...innerBlocksProps} />
					</div>
					<SectionSVG position='top' svgData={svgDataTop} />
					<SectionSVG position='bottom' svgData={svgDataBottom} />
				</OuterTag>
			</>
		);
	},
	// save: deprecated[0].save,
	save: ({ attributes }) => {
		const {
			media,
			innerSize,
			height,
			svgTop,
			svgBottom,
			contentPosition,
			filter,
			isRepeat,
			tag,
		} = attributes;

		// styleデータ
		const style = getBlockStyle(attributes);

		// svgデータ
		const svgDataTop = getSvgData(svgTop);
		const svgDataBottom = getSvgData(svgBottom);

		// SVG分のpadding
		if (0 !== svgDataTop.height) {
			style['--arkb-svg-height--top'] = `${svgDataTop.height}vw`;
		}
		if (0 !== svgDataBottom.height) {
			style['--arkb-svg-height--bottom'] = `${svgDataBottom.height}vw`;
		}

		// カラーレイヤーのスタイル
		const colorStyle = getColorStyle(attributes);

		// ブロックProps
		const blockProps = useBlockProps.save({
			className: classnames(blockName, {
				'has-bg-img': !!media.url,
			}),
			style: style || null,
			'data-height': height || null,
			'data-inner': innerSize || null,
		});

		const OuterTag = tag || 'div';
		return (
			<OuterTag {...blockProps}>
				{media.url && !isRepeat && <RawHTML>{'<!-- media -->'}</RawHTML>}
				<div className={`${blockName}__color arkb-absLayer`} style={colorStyle}></div>
				{'off' !== filter && (
					<div className={`c-filterLayer -filter-${filter} arkb-absLayer`}></div>
				)}
				<div
					className={`${blockName}__body`}
					data-content={contentPosition.replace(' ', '-')}
				>
					<div className={`${blockName}__bodyInner ark-keep-mt`}>
						<InnerBlocks.Content />
					</div>
				</div>
				<SectionSVG position='top' svgData={svgDataTop} />
				<SectionSVG position='bottom' svgData={svgDataBottom} />
			</OuterTag>
		);
	},
	deprecated,
});
