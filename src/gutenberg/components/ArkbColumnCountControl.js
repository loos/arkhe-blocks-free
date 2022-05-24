/**
 * @WordPress dependencies
 */
// import { __ } from '@wordpress/i18n';
import {
	// PanelBody,
	RangeControl,
	Flex,
	FlexItem,
	FlexBlock,
} from '@wordpress/components';
import { memo } from '@wordpress/element';
import { Icon, mobile, tablet, desktop } from '@wordpress/icons';

const DEFAULT_COUNT = {
	pc: 2,
	tab: 2,
	mobile: 1,
};

/**
 * ArkbColumnCountControl
 */
export default memo(({ columnCount, defaultCount, setAttributes, min = 1, max = 8 }) => {
	const defaults = defaultCount || DEFAULT_COUNT;
	const setCount = (device, newVal) => {
		if (defaults[device] === newVal) {
			setAttributes({ columnCount: { ...columnCount, [device]: undefined } });
		} else {
			setAttributes({ columnCount: { ...columnCount, [device]: newVal } });
		}
	};

	return (
		<div className='arkb-columnCountControl'>
			<Flex>
				<FlexItem>
					<Icon icon={desktop} />
				</FlexItem>
				<FlexBlock>
					<RangeControl
						value={columnCount?.pc || defaults.pc}
						onChange={(val) => {
							setCount('pc', val);
						}}
						min={min}
						max={max}
					/>
				</FlexBlock>
			</Flex>
			<Flex>
				<FlexItem>
					<Icon icon={tablet} />
				</FlexItem>
				<FlexBlock>
					<RangeControl
						value={columnCount?.tab || defaults.tab}
						onChange={(val) => {
							setCount('tab', val);
						}}
						min={min}
						max={max}
					/>
				</FlexBlock>
			</Flex>
			<Flex>
				<FlexItem>
					<Icon icon={mobile} />
				</FlexItem>
				<FlexBlock>
					<RangeControl
						value={columnCount?.mobile || defaults.mobile}
						onChange={(val) => {
							setCount('mobile', val);
						}}
						min={min}
						max={max}
					/>
				</FlexBlock>
			</Flex>
		</div>
	);
});
