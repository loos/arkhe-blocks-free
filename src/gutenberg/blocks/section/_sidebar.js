/**
 * @WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { ColorPalette } from '@wordpress/block-editor';
import {
	PanelBody,
	ToggleControl,
	BaseControl,
	RangeControl,
	SelectControl,
	ButtonGroup,
	Button,
	Flex,
	FlexBlock,
	FlexItem,
} from '@wordpress/components';
import { useMemo, useCallback } from '@wordpress/element';
import PanelColorGradientSettings from '@compatible/PanelColorGradientSettings';

/**
 * @Inner dependencies
 */
import ImageTab from './components/ImageTab';
import { DEFAULT_MEDIA_ATTRS } from './config';
import { getButtonSVG } from './components/SectionSVG';
import ArkbUnitNumber from '@components/ArkbUnitNumber';
import ArkbDeviceTab from '@components/ArkbDeviceTab';
import ArkbPaddingControl from '@components/ArkbPaddingControl';
import ArkbHeightControl from '@components/ArkbHeightControl';

/**
 * 設定
 */
// const units = ['px', 'rem', 'em', '%', 'vw', 'vh'];

const TAGS = [
	{
		label: '<div>',
		value: 'div',
	},
	{
		label: '<section>',
		value: 'section',
	},
];

const TEXT_COLORS = [
	{
		name: __('White', 'arkhe-blocks'),
		color: '#fff',
	},
	{
		name: __('Black', 'arkhe-blocks'),
		color: '#000',
	},
];

const SVG_TYPES = ['line', 'circle', 'wave', 'zigzag'];

export default ({ attributes, setAttributes, isSelected }) => {
	const {
		// align,
		media,
		mediaSP,
		focalPoint,
		focalPointSP,
		isRepeat,
		bgSize,
		opacity,
		bgColor,
		bgGradient,
		textColor,
		filter,
		height,
		heightPC,
		heightSP,
		paddingPC,
		paddingSP,
		tag,
		svgTop,
		svgBottom,
	} = attributes;

	const mediaUrl = media.url;

	const setTextColor = useCallback(
		(newColor) => {
			setAttributes({ textColor: newColor });
		},
		[textColor]
	);

	const setOverlayColor = useCallback(
		(newColor) => {
			setAttributes({ bgColor: newColor });
		},
		[setAttributes]
	);

	const setGradientColor = useCallback(
		(newGradient) => {
			setAttributes({ bgGradient: newGradient });
		},
		[setAttributes]
	);

	// ループ内等で同じ関数複数使うのでuseCallback
	const setSVG = useCallback(
		(position, newAttrs) => {
			if ('top' === position) {
				setAttributes({ svgTop: { ...svgTop, ...newAttrs } });
			} else if ('bottom' === position) {
				setAttributes({ svgBottom: { ...svgBottom, ...newAttrs } });
			}
		},
		[setAttributes, svgTop, svgBottom]
	);

	// ブロック選択時の初回の状態を記憶
	const { isOpenSvgTop, isOpenSvgBottom } = useMemo(() => {
		return {
			isOpenSvgTop: 0 !== svgTop.level,
			isOpenSvgBottom: 0 !== svgBottom.level,
		};
	}, [isSelected]);

	// 外に出すとarkbVarsセット前になるのでedit内で。
	const FILTER_HELP = !window.arkbVars?.isArkhe
		? __('This is only available when the theme is Arkhe.', 'arkhe-blocks')
		: null;

	return (
		<>
			<PanelBody title={__('Height settings', 'arkhe-blocks')}>
				<ArkbHeightControl
					heightType={height}
					heightPC={heightPC}
					heightSP={heightSP}
					setAttributes={setAttributes}
				/>
			</PanelBody>
			<PanelBody title={__('Background media setting', 'arkhe-blocks')}>
				<ImageTab
					attrs={{
						media,
						mediaSP,
						focalPoint,
						focalPointSP,
						isRepeat,
						opacity,
					}}
					setAttributes={setAttributes}
				/>
				<ToggleControl
					// フィルター設定。あとで数を増やせるように bool ではなく string で管理。
					label={__('Apply a dot filter', 'arkhe-blocks')}
					checked={'dot' === filter}
					onChange={(val) => {
						if (val) {
							setAttributes({ filter: 'dot' });
						} else {
							setAttributes({ filter: 'off' });
						}
					}}
					className='arkb-ctrl--mt--s arkb-ctrl--mb--xs'
					help={FILTER_HELP}
				/>
				{'image' === media.type && (
					<ToggleControl
						className='arkb-ctrl--mb--xs'
						label={__('Repeat the background image', 'arkhe-blocks')}
						checked={isRepeat}
						onChange={(val) => {
							setAttributes({ isRepeat: val });
							if (val) {
								setAttributes({
									mediaSP: DEFAULT_MEDIA_ATTRS,
									focalPoint: undefined,
								});
							}
						}}
					/>
				)}
				{isRepeat && (
					<Flex style={{ margin: '0 0 16px' }}>
						<FlexItem>{__('Background Size', 'arkhe-blocks')} : </FlexItem>
						<FlexBlock>
							<ArkbUnitNumber
								value={bgSize}
								onChange={(newVal) => {
									setAttributes({ bgSize: newVal });
								}}
							/>
						</FlexBlock>
					</Flex>
				)}
			</PanelBody>
			<PanelBody title={__('Tag setting', 'arkhe-blocks')}>
				<SelectControl
					value={tag}
					options={TAGS}
					onChange={(val) => {
						setAttributes({ tag: val });
					}}
				/>
			</PanelBody>
			<PanelColorGradientSettings
				title={__('Color settings', 'arkhe-blocks')}
				initialOpen={true}
				settings={[
					{
						colorValue: textColor,
						colors: TEXT_COLORS,
						onColorChange: setTextColor,
						label: __('Text color', 'arkhe-blocks'),
					},
					{
						colorValue: bgColor,
						gradientValue: bgGradient,
						onColorChange: setOverlayColor,
						onGradientChange: setGradientColor,
						label: mediaUrl
							? __('Overlay color', 'arkhe-blocks')
							: __('Background color', 'arkhe-blocks'),
					},
				]}
			>
				<RangeControl
					label={
						mediaUrl
							? __('Overlay opacity', 'arkhe-blocks')
							: __('Background opacity', 'arkhe-blocks')
					}
					value={opacity}
					onChange={(val) => {
						setAttributes({ opacity: val });
					}}
					min={0}
					max={100}
				/>
			</PanelColorGradientSettings>
			<PanelBody title={__('Padding settings', 'arkhe-blocks')}>
				<ArkbDeviceTab
					className='-padding'
					controlPC={
						<ArkbPaddingControl
							name='paddingPC'
							value={paddingPC}
							setAttributes={setAttributes}
						/>
					}
					controlSP={
						<ArkbPaddingControl
							name='paddingSP'
							value={paddingSP}
							setAttributes={setAttributes}
						/>
					}
				/>
			</PanelBody>
			<PanelBody title={__('Top border', 'arkhe-blocks')} initialOpen={isOpenSvgTop}>
				<BaseControl>
					<BaseControl.VisualLabel>{__('Shape', 'arkhe-blocks')}</BaseControl.VisualLabel>
					<ButtonGroup className='arkb-btns--svg -top'>
						{SVG_TYPES.map((type) => {
							return (
								<Button
									isSecondary={type !== svgTop.type}
									isPrimary={type === svgTop.type}
									onClick={() => {
										setSVG('top', { type });
									}}
									key={`key_${type}`}
								>
									{getButtonSVG(type)}
								</Button>
							);
						})}
					</ButtonGroup>
				</BaseControl>
				<RangeControl
					label={__('Height level', 'arkhe-blocks')}
					value={svgTop.level}
					min={-100}
					max={100}
					step={1}
					onChange={(level) => {
						setSVG('top', { level });
					}}
				/>
				<div className='components-base-control'>
					<div className='components-base-control__label'>
						{__('Color', 'arkhe-blocks')}
					</div>
					<ColorPalette
						value={svgTop.color}
						clearable={true}
						onChange={(color) => {
							setSVG('top', { color });
						}}
					/>
				</div>
			</PanelBody>
			<PanelBody title={__('Bottom border', 'arkhe-blocks')} initialOpen={isOpenSvgBottom}>
				<BaseControl>
					<BaseControl.VisualLabel>{__('Shape', 'arkhe-blocks')}</BaseControl.VisualLabel>
					<ButtonGroup className='arkb-btns--svg -bottom'>
						{SVG_TYPES.map((type) => {
							return (
								<Button
									isSecondary={type !== svgBottom.type}
									isPrimary={type === svgBottom.type}
									onClick={() => {
										setSVG('bottom', { type });
									}}
									key={`key_${type}`}
								>
									{getButtonSVG(type)}
								</Button>
							);
						})}
					</ButtonGroup>
				</BaseControl>
				<RangeControl
					label={__('Height level', 'arkhe-blocks')}
					value={svgBottom.level}
					min={-100}
					max={100}
					step={1}
					onChange={(level) => {
						setSVG('bottom', { level });
					}}
				/>
				<BaseControl>
					<BaseControl.VisualLabel>{__('Color', 'arkhe-blocks')}</BaseControl.VisualLabel>
					<ColorPalette
						value={svgBottom.color}
						clearable={true}
						onChange={(color) => {
							setSVG('bottom', { color });
						}}
					/>
				</BaseControl>
			</PanelBody>
		</>
	);
};
