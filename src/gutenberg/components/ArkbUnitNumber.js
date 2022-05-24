/**
 * @WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Button } from '@wordpress/components';
import { useInstanceId } from '@wordpress/compose';
import UnitControl from '@compatible/UnitControl';

/**
 * @Others dependencies
 */
import classnames from 'classnames';

/**
 * 設定
 */
const UNITS = ['px', 'rem', 'em', '%', 'vw', 'vh'];

/**
 * attributes を数値と単位に分離する
 */
const getUnitNum = (val, defaultUnit) => {
	if (!val) {
		return { num: '', unit: defaultUnit || 'px' };
	}

	// 念のため、明示的に文字列へ変換。
	const valString = val.toString();
	const num = valString.replace(/[^0-9\.]/g, '');
	const unit = valString.replace(/[0-9\.]/g, '');
	return { num: parseFloat(num), unit };
};

/**
 * ArkbUnitNumber
 */
export default ({
	value,
	units,
	min,
	max,
	onChange,
	defaultUnit,
	step = '1',
	className = '',
	onClear = null,
	// idKey = '',
}) => {
	const _UNITS = units || UNITS;
	const { num, unit } = getUnitNum(value, defaultUnit);

	const instanceId = useInstanceId(UnitControl);
	const inputId = instanceId;
	// const isPx = unit === 'px';
	// text-transform: uppercase;

	return (
		<div className={classnames('arkb-unitNumber', className, { 'has-clear': !!onClear })}>
			<UnitControl
				id={inputId}
				value={num}
				min={min || 0}
				max={max || undefined}
				step={'px' === unit ? '1' : step}
				unit={unit}
				units={_UNITS.map((_unit) => {
					return { label: _unit, value: _unit };
				})}
				onBlur={null}
				onChange={(val) => {
					onChange(val);
				}}
				// onUnitChange={() => {}} // onChange が先に走ってるので、何もする必要ない
				// isResetValueOnUnitChange // default値に戻すかどうか？
			/>
			{onClear && (
				<Button
					isSmall
					isSecondary
					text={__('Clear')}
					onClick={() => {
						onClear();
					}}
				/>
			)}
		</div>
	);
};
