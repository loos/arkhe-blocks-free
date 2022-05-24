/**
 * @WordPress dependencies
 */
// import { __ } from '@wordpress/i18n';
import { Flex, FlexItem, FlexBlock } from '@wordpress/components';
import { memo } from '@wordpress/element';
import { Icon, mobile, tablet, desktop } from '@wordpress/icons';

/**
 * @SWELL dependencies
 */
import ArkbUnitNumber from '@components/ArkbUnitNumber';

const DEFAULT_WIDTH = {
	pc: undefined,
	tab: undefined,
	mobile: undefined,
};

/**
 * ArkbColumnWidthControl
 */
export default memo(({ columnWidth, setAttributes, defaultUnit, defaultWidth, isLinked }) => {
	const defaults = defaultWidth || DEFAULT_WIDTH;
	const setWidth = (device, newVal) => {
		if (isLinked) {
			setAttributes({
				columnWidth: {
					pc: newVal,
					tab: newVal,
					mobile: newVal,
				},
			});
		} else {
			setAttributes({ columnWidth: { ...columnWidth, [device]: newVal } });
		}
	};

	const widthPC = columnWidth?.pc || '';
	const maxPC = widthPC.match(/px/) ? undefined : 100;

	const widthTab = columnWidth?.tab || '';
	const maxTab = widthTab.match(/px/) ? undefined : 100;

	const widthMB = columnWidth?.mobile || '';
	const maxMB = widthMB.match(/px/) ? undefined : 100;

	return (
		<div className='arkb-columnWidthControl'>
			<Flex>
				<FlexItem>
					<Icon icon={desktop} />
				</FlexItem>
				<FlexBlock>
					<ArkbUnitNumber
						value={widthPC}
						max={maxPC}
						step='1'
						defaultUnit={defaultUnit || ''}
						units={['em', 'px', 'vw', '%']}
						onChange={(newVal) => {
							setWidth('pc', newVal);
						}}
						onClear={() => {
							setWidth('pc', defaults?.pc || undefined);
						}}
					/>
				</FlexBlock>
			</Flex>
			<Flex>
				<FlexItem>
					<Icon icon={tablet} />
				</FlexItem>
				<FlexBlock>
					<ArkbUnitNumber
						value={widthTab}
						max={maxTab}
						step='1'
						defaultUnit={defaultUnit || ''}
						units={['em', 'px', 'vw', '%']}
						onChange={(newVal) => {
							setWidth('tab', newVal);
						}}
						onClear={() => {
							setWidth('tab', defaults?.tab || undefined);
						}}
					/>
				</FlexBlock>
			</Flex>
			<Flex>
				<FlexItem>
					<Icon icon={mobile} />
				</FlexItem>
				<FlexBlock>
					<ArkbUnitNumber
						value={widthMB}
						max={maxMB}
						step='1'
						defaultUnit={defaultUnit || ''}
						units={['em', 'px', 'vw', '%']}
						onChange={(newVal) => {
							setWidth('mobile', newVal);
						}}
						onClear={() => {
							setWidth('mobile', defaults?.mobile || undefined);
						}}
					/>
				</FlexBlock>
			</Flex>
		</div>
	);
});
