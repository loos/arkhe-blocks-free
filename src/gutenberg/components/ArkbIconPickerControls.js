/**
 * @WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
// import { useState } from '@wordpress/element';
import { BaseControl, TextControl } from '@wordpress/components';

/**
 * @Inner dependencies
 */
import ArkbIconPicker from './ArkbIconPicker';
import ArkbHelpTip from './ArkbHelpTip';

/**
 * ArkbIconPickerControls
 */
const ArkbIconPickerControls = ({ value = '', onChange, icons = null }) => {
	return (
		<>
			<BaseControl>
				<BaseControl.VisualLabel>
					{__('Select Icon', 'arkhe-blocks')}
				</BaseControl.VisualLabel>
				<ArkbIconPicker value={value} onChange={onChange} icons={icons} />
			</BaseControl>
			<TextControl
				className='arkb-iconNameInput'
				label={__('Icon Name', 'arkhe-blocks')}
				value={value || ''}
				onChange={onChange}
			/>
			<div className='arkb-helpText--iconPicker u-mb-20'>
				<ArkbHelpTip type='icon-picker' />
			</div>
		</>
	);
};

export default ArkbIconPickerControls;
