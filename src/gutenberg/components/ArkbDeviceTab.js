/**
 * @WordPress dependencies
 */
// import { __ } from '@wordpress/i18n';
// import { memo } from '@wordpress/element';
import { TabPanel } from '@wordpress/components';
import { Icon, mobile, desktop } from '@wordpress/icons';

/**
 * ArkbDeviceTab
 */
export default ({ className, controlPC, controlSP, isHideTab }) => {
	const deviceTabs = [
		{
			name: 'pc',
			title: (
				<>
					<Icon icon={desktop} />
					<span>PC</span>
				</>
			),
			className: '__pc',
		},
		{
			name: 'sp',
			title: (
				<>
					<Icon icon={mobile} />
					<span>SP</span>
				</>
			),
			className: '__sp',
		},
	];

	let tabClass = 'arkb-tabPanel -device';
	if (className) tabClass += ` ${className}`;
	if (isHideTab) tabClass += ' is-hide';

	return (
		<TabPanel
			className={tabClass}
			activeClass='is-active'
			tabs={deviceTabs}
			initialTabName='pc'
		>
			{(tab) => {
				if ('pc' === tab.name) {
					return controlPC;
				} else if ('sp' === tab.name) {
					return controlSP;
				}
			}}
		</TabPanel>
	);
};
