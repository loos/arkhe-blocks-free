/**
 * @WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
// import {} from '@wordpress/block-editor';
import { memo } from '@wordpress/element';
import { Icon, mobile, desktop } from '@wordpress/icons';
import { SelectControl, Flex, FlexBlock, FlexItem } from '@wordpress/components';

/**
 * @Inner dependencies
 */
import ArkbUnitNumber from '@components/ArkbUnitNumber';

const HIEGHT_TYPES = [
	{
		label: __('Fit to content', 'arkhe-blocks'),
		value: 'content',
	},
	{
		label: __('Fit screen', 'arkhe-blocks'),
		value: 'full',
	},
	{
		label: __('Specify by number', 'arkhe-blocks'),
		value: 'custom',
	},
];
const ArkbHeightControl = memo(
	({
		heightType,
		heightPC,
		heightSP,
		setAttributes,
		disableFitContent = false,
		// typeSlug = 'height',
	}) => {
		let heightTypes = [];
		if (disableFitContent) {
			heightTypes = HIEGHT_TYPES.slice(1);
		} else {
			heightTypes = HIEGHT_TYPES;
		}
		return (
			<>
				<SelectControl
					value={heightType}
					options={heightTypes}
					onChange={(val) => {
						setAttributes({ height: val });
					}}
				/>
				<div
					data-ark-disabled={'custom' !== heightType || null}
					style={{ marginTop: '16px' }}
				>
					<Flex>
						<FlexItem style={{ marginRight: '4px' }}>
							<Icon icon={desktop} />
						</FlexItem>
						<FlexItem style={{ width: '2em' }}>PC</FlexItem>
						<FlexBlock>
							<ArkbUnitNumber
								value={heightPC}
								onChange={(val) => {
									setAttributes({ heightPC: val });
								}}
							/>
						</FlexBlock>
					</Flex>
					<Flex style={{ marginTop: '8px' }}>
						<FlexItem style={{ marginRight: '4px' }}>
							<Icon icon={mobile} />
						</FlexItem>
						<FlexItem style={{ width: '2em' }}>SP</FlexItem>
						<FlexBlock>
							<ArkbUnitNumber
								value={heightSP}
								onChange={(val) => {
									setAttributes({ heightSP: val });
								}}
							/>
						</FlexBlock>
					</Flex>
				</div>
			</>
		);
	}
);
export default ArkbHeightControl;
