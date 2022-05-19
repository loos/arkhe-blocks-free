/**
 * @WordPress dependencies
 */
import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';
import { RawHTML } from '@wordpress/element';

/**
 * @Internal dependencies
 */
import SectionSVG, { SectionSVGOld } from './components/SectionSVG';
import { BgImage } from './components/BgImageOld';
import { getPositionClassName } from '@helper/getPositionClassName';
import {
	getBlockStyleV2,
	getBlockStyleV1,
	// getBlockStyle,
	// getColorStyle,
	getSvgDataOld,
	getSvgData,
} from './_helper';

const getColorStyle = ({ bgColor, bgGradient, opacity }) => {
	const style = {};

	// グラデーションかどうか
	if (bgGradient) {
		style.background = bgGradient;
	} else {
		style.backgroundColor = bgColor || '#f7f7f7';
	}
	style.opacity = (opacity * 0.01).toFixed(2);
	return style;
};

/**
 */
import classnames from 'classnames';
// import hexToRgba from 'hex-to-rgba';

/**
 * metadata
 */
const blockName = 'ark-block-section';
const oldSupports = {
	anchor: true,
	className: false,
	align: ['wide', 'full'],
};
export default [
	{
		supports: oldSupports,
		attributes: {
			align: {
				type: 'string',
				default: 'full',
			},
			bgColor: {
				type: 'string',
			},
			bgGradient: {
				type: 'string',
			},
			opacity: {
				type: 'number',
				default: 100,
			},
			textColor: {
				type: 'string',
				default: '',
			},
			filter: {
				type: 'string',
				default: 'off',
			},
			media: {
				type: 'object',
				default: {
					id: 0,
					url: '',
				},
			},
			mediaSP: {
				type: 'object',
				default: {
					id: 0,
					url: '',
				},
			},
			focalPoint: {
				type: 'object',
			},
			focalPointSP: {
				type: 'object',
			},
			contentPosition: {
				type: 'string',
				default: 'center left',
			},
			innerSize: {
				type: 'string',
				default: '',
			},
			height: {
				type: 'string',
				default: 'content',
			},
			heightPC: {
				type: 'string',
				default: '400px',
			},
			heightSP: {
				type: 'string',
				default: '50vh',
			},
			paddingPC: {
				type: 'object',
				default: {
					top: '4rem',
					left: '2rem',
					right: '2rem',
					bottom: '4rem',
				},
			},
			paddingSP: {
				type: 'object',
				default: {
					top: '4rem',
					left: '4vw',
					right: '4vw',
					bottom: '4rem',
				},
			},
			isRepeat: {
				type: 'boolean',
				default: false,
			},
			bgSize: {
				type: 'string',
				default: '',
			},
			tag: {
				type: 'string',
				default: 'div',
			},
			svgTop: {
				type: 'object',
				default: {
					type: 'line',
					level: 0,
					color: '',
				},
			},
			svgBottom: {
				type: 'object',
				default: {
					type: 'line',
					level: 0,
					color: '',
				},
			},
		},
		migrate: (attributes) => {
			const newAttrs = { ...attributes };

			// if ('' === attributes.innerSize) {
			// 	if ('2rem' === attributes.paddingPC.left) {
			// 		newAttrs.paddingPC.left = '0rem';
			// 	}
			// 	if ('2rem' === attributes.paddingPC.right) {
			// 		newAttrs.paddingPC.right = '0rem';
			// 	}
			// 	if ('4vw' === attributes.paddingSP.left) {
			// 		newAttrs.paddingSP.left = '0rem';
			// 	}
			// 	if ('4vw' === attributes.paddingSP.right) {
			// 		newAttrs.paddingSP.right = '0rem';
			// 	}
			// }

			if (undefined === attributes.bgColor) {
				newAttrs.bgColor = '#f7f7f7';
			}

			/* eslint camelcase: off */
			const oldDefaultPC = { top: '4rem', left: '2rem', right: '2rem', bottom: '4rem' };
			const oldDefaultPC_JSON = JSON.stringify(oldDefaultPC);
			const oldAttrPC_JSON = JSON.stringify(attributes.paddingPC);

			if (oldDefaultPC_JSON === oldAttrPC_JSON) {
				newAttrs.paddingPC = { top: '4rem', left: '0rem', right: '0rem', bottom: '4rem' };
			}

			const oldDefaultSP = { top: '4rem', left: '4vw', right: '4vw', bottom: '4rem' };
			const oldDefaultSP_JSON = JSON.stringify(oldDefaultSP);
			const oldAttrSP_JSON = JSON.stringify(attributes.paddingSP);

			if (oldDefaultSP_JSON === oldAttrSP_JSON) {
				newAttrs.paddingSP = { top: '4rem', left: '0rem', right: '0rem', bottom: '4rem' };
			}

			return newAttrs;
		},
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
			const style = getBlockStyleV2(attributes);

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
	},
	{
		supports: oldSupports,
		attributes: {
			className: {
				type: 'string',
				default: '',
			},
			anchor: {
				type: 'string',
				default: '',
			},
			align: {
				type: 'string',
				default: 'full',
			},
			bgColor: {
				type: 'string',
			},
			bgGradient: {
				type: 'string',
			},
			opacity: {
				type: 'number',
				default: 100,
			},
			textColor: {
				type: 'string',
				default: '',
			},
			filter: {
				type: 'string',
				default: 'off',
			},
			media: {
				type: 'object',
				default: {
					id: 0,
					url: '',
					type: '',
					size: 'full',
				},
			},
			mediaSP: {
				type: 'object',
				default: {
					id: 0,
					url: '',
					type: '',
					size: 'full',
				},
			},
			focalPoint: {
				type: 'object',
			},
			focalPointSP: {
				type: 'object',
			},
			contentPosition: {
				type: 'string',
				default: 'center left',
			},
			innerSize: {
				type: 'string',
				default: '',
			},
			height: {
				type: 'string',
				default: 'content',
			},
			heightPC: {
				type: 'string',
				default: '400px',
			},
			heightSP: {
				type: 'string',
				default: '50vh',
			},
			paddingPC: {
				type: 'object',
				default: {
					top: '4rem',
					left: '2rem',
					right: '2rem',
					bottom: '4rem',
				},
			},
			paddingSP: {
				type: 'object',
				default: {
					top: '4rem',
					left: '4vw',
					right: '4vw',
					bottom: '4rem',
				},
			},
			isRepeat: {
				type: 'boolean',
				default: false,
			},
			bgSize: {
				type: 'string',
				default: '',
			},
			svgTop: {
				type: 'object',
				default: {
					type: 'line',
					level: 0,
					color: '',
				},
			},
			svgBottom: {
				type: 'object',
				default: {
					type: 'line',
					level: 0,
					color: '',
				},
			},
		},
		save: () => {
			return <InnerBlocks.Content />;
		},
	},
	{
		supports: oldSupports,
		attributes: {
			align: {
				type: 'string',
				default: 'full',
			},
			bgColor: {
				type: 'string',
			},
			bgGradient: {
				type: 'string',
			},
			opacity: {
				type: 'number',
				default: 100,
			},
			textColor: {
				type: 'string',
				default: '',
			},
			mediaId: {
				type: 'number',
				default: 0,
			},
			mediaUrl: {
				type: 'string',
				default: '',
			},
			mediaWidth: {
				type: 'string',
				source: 'attribute',
				selector: '.ark-block-section__bg[data-for="pc"]',
				attribute: 'width',
			},
			mediaHeight: {
				type: 'string',
				source: 'attribute',
				selector: '.ark-block-section__bg[data-for="pc"]',
				attribute: 'height',
			},
			mediaIdSP: {
				type: 'number',
				default: 0,
			},
			mediaUrlSP: {
				type: 'string',
				source: 'attribute',
				selector: '.ark-block-section__bg[data-for="sp"]',
				attribute: 'src',
			},
			mediaWidthSP: {
				type: 'string',
				source: 'attribute',
				selector: '.ark-block-section__bg[data-for="sp"]',
				attribute: 'width',
			},
			mediaHeightSP: {
				type: 'string',
				source: 'attribute',
				selector: '.ark-block-section__bg[data-for="sp"]',
				attribute: 'height',
			},
			mediaType: {
				type: 'string',
				default: '',
			},
			mediaTypeSP: {
				type: 'string',
				default: '',
			},
			focalPoint: {
				type: 'object',
			},
			focalPointSP: {
				type: 'object',
			},
			contentPosition: {
				type: 'string',
			},
			innerSize: {
				type: 'string',
				default: '',
			},
			heightPC: {
				type: 'number',
			},
			heightSP: {
				type: 'number',
			},
			heightUnitPC: {
				type: 'string',
				default: 'px',
			},
			heightUnitSP: {
				type: 'string',
				default: 'px',
			},
			isFullscreen: {
				type: 'boolean',
				default: false,
			},
			padPC: {
				type: 'number',
				default: 4,
			},
			padSP: {
				type: 'number',
				default: 4,
			},
			padUnitPC: {
				type: 'string',
				default: 'rem',
			},
			padUnitSP: {
				type: 'string',
				default: 'rem',
			},
			isRepeat: {
				type: 'boolean',
				default: false,
			},
			svgTypeTop: {
				type: 'string',
				default: 'line',
			},
			svgLevelTop: {
				type: 'number',
				default: 0,
			},
			svgTypeBottom: {
				type: 'string',
				default: 'line',
			},
			svgLevelBottom: {
				type: 'number',
				default: 0,
			},
			svgColorTop: {
				type: 'string',
				default: '',
			},
			svgColorBottom: {
				type: 'string',
				default: '',
			},
		},
		migrate: (attributes) => {
			// media
			const media = {
				id: attributes.mediaId,
				url: attributes.mediaUrl,
				type: attributes.mediaType,
				width: attributes.mediaWidth || 0,
				height: attributes.mediaHeight || 0,
				// size: 'full',
			};
			const mediaSP = {
				id: attributes.mediaIdSP,
				url: attributes.mediaUrlSP,
				type: attributes.mediaTypeSP,
				width: attributes.mediaWidthSP || 0,
				height: attributes.mediaHeightSP || 0,
				// size: 'full',
			};

			delete attributes.mediaId;
			delete attributes.mediaIdSP;
			delete attributes.mediaType;
			delete attributes.mediaTypeSP;
			delete attributes.mediaUrl;
			delete attributes.mediaUrlSP;
			delete attributes.mediaWidth;
			delete attributes.mediaHeight;
			delete attributes.mediaWidthSP;
			delete attributes.mediaHeightSP;

			// height
			let height = 'content';
			let heightPC = '400px';
			let heightSP = '50vh';
			if (attributes.heightPC || attributes.heightSP) {
				height = 'custom';
				heightPC = `${attributes.heightPC}${attributes.heightUnitPC}`;
				heightSP = `${attributes.heightSP}${attributes.heightUnitSP}`;
			}
			delete attributes.heightUnitPC;
			delete attributes.heightUnitSP;

			// padding
			const paddingPC = { top: '4rem', left: '2rem', right: '2rem', bottom: '4rem' };
			const paddingSP = { top: '4rem', left: '4vw', right: '4vw', bottom: '4rem' };
			const _padPC = `${attributes.padPC}${attributes.padUnitPC}`;
			const _padSP = `${attributes.padSP}${attributes.padUnitSP}`;
			paddingPC.top = _padPC;
			paddingPC.bottom = _padPC;
			paddingSP.top = _padSP;
			paddingSP.bottom = _padSP;

			delete attributes.padPC;
			delete attributes.padSP;
			delete attributes.padUnitPC;
			delete attributes.padUnitSP;

			// svg
			const svgTop = {
				type: attributes.svgTypeTop,
				level: attributes.svgLevelTop,
				color: attributes.svgColorTop,
			};
			const svgBottom = {
				type: attributes.svgTypeBottom,
				level: attributes.svgLevelBottom,
				color: attributes.svgColorBottom,
			};
			delete attributes.svgTypeTop;
			delete attributes.svgLevelTop;
			delete attributes.svgColorTop;
			delete attributes.svgTypeBottom;
			delete attributes.svgLevelBottom;
			delete attributes.svgColorBottom;

			// その他
			const contentPosition = attributes.contentPosition || 'center left';
			delete attributes.isFullscreen;

			return {
				...attributes,
				media,
				mediaSP,
				height,
				heightPC,
				heightSP,
				paddingPC,
				paddingSP,
				contentPosition,
				svgTop,
				svgBottom,
			};
		},
		save: ({ attributes }) => {
			const {
				mediaUrl,
				innerSize,
				svgLevelTop,
				svgLevelBottom,
				svgTypeTop,
				svgTypeBottom,
				svgColorTop,
				svgColorBottom,
				contentPosition,
				isFullscreen,
			} = attributes;

			// styleデータ
			const style = getBlockStyleV1(attributes);

			// カラーレイヤーのスタイル
			const colorStyle = getColorStyle(attributes);

			// svgデータ
			const svgTop = getSvgDataOld(svgLevelTop);
			const svgBottom = getSvgDataOld(svgLevelBottom);

			// SVG分のpadding
			if (0 !== svgLevelTop) {
				style.paddingTop = `${svgTop.height}vw`;
			}
			if (0 !== svgLevelBottom) {
				style.paddingBottom = `${svgBottom.height}vw`;
			}

			// クラス名
			const positionClass = getPositionClassName(contentPosition, '');
			const blockClass = classnames(blockName, positionClass, {
				'has-bg-img': !!mediaUrl,
				'has-position': !!positionClass,
			});

			// ブロックProps
			const blockProps = useBlockProps.save({
				className: blockClass,
				style: style || null,
				'data-inner': innerSize || null,
				'data-fullscreen': isFullscreen ? '1' : null,
			});

			return (
				<div {...blockProps}>
					<BgImage attributes={attributes} />
					<div className={`${blockName}__color`} style={colorStyle}></div>
					<div className={`${blockName}__inner ark-keep-mt`}>
						<InnerBlocks.Content />
					</div>
					{0 !== svgLevelTop && (
						<SectionSVGOld
							position='top'
							type={svgTypeTop}
							height={svgTop.height}
							isReverse={svgTop.isReverse}
							fillColor={svgColorTop}
						/>
					)}
					{0 !== svgLevelBottom && (
						<SectionSVGOld
							position='bottom'
							type={svgTypeBottom}
							height={svgBottom.height}
							isReverse={svgBottom.isReverse}
							fillColor={svgColorBottom}
						/>
					)}
				</div>
			);
		},
	},
];
