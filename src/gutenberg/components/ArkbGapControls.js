/**
 * @WordPress dependencies
 */
import { __, _x } from '@wordpress/i18n';
import { BaseControl, Flex, FlexItem, FlexBlock } from '@wordpress/components';

/**
 * @Internal dependencies
 */
import ArkbUnitNumber from '@components/ArkbUnitNumber';

/**
 * @Others dependencies
 */
// import classnames from 'classnames';

/**
 * ArkbGapControls
 */
const ArkbGapControls = ({ gap, setAttributes }) => {
	return (
		<BaseControl>
			<BaseControl.VisualLabel>{__('Margins', 'arkhe-blocks')}</BaseControl.VisualLabel>
			<div className='arkb-gapControl'>
				<Flex className='arkb-gapControl__row'>
					<FlexItem>{_x('Horizontal', 'margin', 'arkhe-blocks')}</FlexItem>
					<FlexBlock>
						<ArkbUnitNumber
							value={gap?.x || '1.5rem'}
							step='0.5'
							onChange={(newVal) => {
								setAttributes({ gap: { ...gap, x: newVal } });
							}}
							onClear={() => {
								setAttributes({ gap: { ...gap, x: undefined } });
							}}
						/>
					</FlexBlock>
				</Flex>
				<Flex className='arkb-gapControl__row'>
					<FlexItem>{_x('Vertical', 'margin', 'arkhe-blocks')}</FlexItem>
					<FlexBlock>
						<ArkbUnitNumber
							value={gap?.y || '1.5rem'}
							step='0.5'
							onChange={(newVal) => {
								setAttributes({ gap: { ...gap, y: newVal } });
							}}
							onClear={() => {
								setAttributes({ gap: { ...gap, y: undefined } });
							}}
						/>
					</FlexBlock>
				</Flex>
			</div>
		</BaseControl>
	);
};

export default ArkbGapControls;
