/**
 * @WordPress dependencies
 */
import { __, _x } from '@wordpress/i18n';
// import { useSelect } from '@wordpress/data';
import { useState, useCallback } from '@wordpress/element';
import { dateI18n } from '@wordpress/date';
import { InspectorControls } from '@wordpress/block-editor';
import {
	PanelBody,
	ToggleControl,
	SelectControl,
	BaseControl,
	CheckboxControl,
	Button,
	Popover,
	DateTimePicker,
	ButtonGroup,
} from '@wordpress/components';
import { calendar, pages, file } from '@wordpress/icons';
import getSettings from '@compatible/useInnerBlocksProps';

/**
 * @Internal dependencies
 */
import { getPostTypes } from '@helper/get_core_data';
import ArkbHelpTip from '@components/ArkbHelpTip';
import ArkbTermPickers from '@components/ArkbTermPickers';

/**
 * 設定
 */
const ROLES = [
	{
		// 管理者
		label: _x('Administrator', 'role', 'arkhe-blocks'),
		value: 'administrator',
	},
	{
		//編集者
		label: _x('Editor', 'role', 'arkhe-blocks'),
		value: 'editor',
	},
	{
		// 投稿者
		label: _x('Author', 'role', 'arkhe-blocks'),
		value: 'author',
	},
	{
		//寄稿者
		label: _x('Contributor', 'role', 'arkhe-blocks'),
		value: 'contributor',
	},
	{
		//購読者
		label: _x('Subscriber', 'role', 'arkhe-blocks'),
		value: 'subscriber',
	},
];

/**
 * 設定
 */
const PAGE_TYPES = [
	{
		label: _x('Front', 'page-type', 'arkhe-blocks'),
		value: 'front',
	},
	{
		label: _x('Home', 'page-type', 'arkhe-blocks'),
		value: 'home',
	},

	{
		label: _x('Archive', 'page-type', 'arkhe-blocks'),
		value: 'archive',
	},
	{
		label: _x('Search', 'page-type', 'arkhe-blocks'),
		value: 'search',
	},
	{
		label: _x('404 Page', 'page-type', 'arkhe-blocks'),
		value: '404',
	},
	{
		label: _x('Singular', 'page-type', 'arkhe-blocks'),
		value: 'singular',
	},
];

/**
 * 制限エリアブロック
 */
export default ({ attributes, setAttributes }) => {
	const {
		roles,
		isRole,
		isLoggedIn,
		isDateTime,
		startDateTime,
		endDateTime,
		isPage,
		pageLimitType,
		pageTypes,
		allowedPostTypes,
		terms,
	} = attributes;

	// state
	const [isOpenStartDateTime, setIsOpenStartDateTime] = useState(false);
	const [isOpenEndDateTime, setIsOpenEndDateTime] = useState(false);

	// 全投稿タイプを取得
	const postTypeList = getPostTypes() || [];

	// termsオブジェクトの更新
	const setTermsOptions = useCallback(
		(newOptions) => {
			setAttributes({ terms: { ...terms, ...newOptions } });
		},
		[setAttributes, terms]
	);

	// 日付制限ある場合
	let dateSettings = null;
	if (isDateTime) {
		// 日時の表示設定を取得
		const settings = getSettings();

		// 12時間表記（AM/PM）かどうか
		const is12Hour = /a(?!\\)/i.test(
			settings.formats.time.toLowerCase().replace(/\\\\/g, '').split('').reverse().join('')
		);
		// 表示用の日付を設定にあわせてフォーマット
		const formattedStartDateTime = startDateTime
			? dateI18n(`${settings.formats.date} ${settings.formats.time}`, startDateTime)
			: __('Not set', 'arkhe-blocks');
		const formattedEndDateTime = endDateTime
			? dateI18n(`${settings.formats.date} ${settings.formats.time}`, endDateTime)
			: __('Not set', 'arkhe-blocks');

		dateSettings = (
			<>
				<BaseControl className='arkb-control--dateTimePicker'>
					<BaseControl.VisualLabel>{__('Start', 'arkhe-blocks')}</BaseControl.VisualLabel>
					<Button
						icon={calendar}
						isTertiary
						onClick={() => {
							setIsOpenStartDateTime(true);
						}}
					>
						{formattedStartDateTime}
					</Button>
					{isOpenStartDateTime && (
						<Popover onClose={() => setIsOpenStartDateTime(false)}>
							<DateTimePicker
								currentDate={startDateTime}
								is12Hour={is12Hour}
								onChange={(val) => {
									setAttributes({ startDateTime: val });
									if (!val) {
										setIsOpenStartDateTime(false);
									}
								}}
							/>
						</Popover>
					)}
				</BaseControl>
				<div className='arkb-control--dash'>〜</div>
				<BaseControl className='arkb-control--dateTimePicker'>
					<BaseControl.VisualLabel>{__('End', 'arkhe-blocks')}</BaseControl.VisualLabel>
					<Button
						icon={calendar}
						isTertiary
						onClick={() => {
							setIsOpenEndDateTime(true);
						}}
					>
						{formattedEndDateTime}
					</Button>
					{isOpenEndDateTime && (
						<Popover onClose={() => setIsOpenEndDateTime(false)}>
							<DateTimePicker
								currentDate={endDateTime}
								is12Hour={is12Hour}
								onChange={(val) => {
									setAttributes({ endDateTime: val });
									if (!val) {
										setIsOpenEndDateTime(false);
									}
								}}
							/>
						</Popover>
					)}
				</BaseControl>
			</>
		);
	}

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Settings', 'arkhe-blocks')}>
					<ToggleControl
						label={__('Restrict by login status', 'arkhe-blocks')}
						checked={isRole}
						onChange={(val) => {
							setAttributes({ isRole: val });
						}}
					/>
					{isRole && (
						<>
							<SelectControl
								label={__('Users who can view this content', 'arkhe-blocks')}
								value={isLoggedIn ? 'loggedIn' : 'noLoggedIn'}
								options={[
									{
										label: __('Non-logged-in users', 'arkhe-blocks'),
										value: 'noLoggedIn',
									},
									{
										label: __('Logged-in users', 'arkhe-blocks'),
										value: 'loggedIn',
									},
								]}
								onChange={(val) => {
									setAttributes({ isLoggedIn: 'loggedIn' === val });
								}}
							/>
							{isLoggedIn && (
								<BaseControl className='arkb-checkboxes -columns'>
									<BaseControl.VisualLabel>
										{__('User Roles to view this content', 'arkhe-blocks')}
									</BaseControl.VisualLabel>
									{ROLES.map((_target) => {
										return (
											<CheckboxControl
												label={_target.label}
												key={`key_${_target.value}`}
												checked={roles[_target.value]}
												onChange={(val) => {
													setAttributes({
														roles: {
															...roles,
															[_target.value]: val,
														},
													});
												}}
											/>
										);
									})}
								</BaseControl>
							)}
						</>
					)}
					<hr />
					<ToggleControl
						label={__('Limit the time period to be displayed', 'arkhe-blocks')}
						checked={isDateTime}
						onChange={(val) => {
							setAttributes({ isDateTime: val });
						}}
					/>
					{isDateTime && dateSettings}
					<hr />
					<ToggleControl
						label={__('Restrict by page', 'arkhe-blocks')}
						checked={isPage}
						onChange={(val) => {
							setAttributes({ isPage: val });
						}}
					/>
					{isPage && (
						<>
							<BaseControl className='arkb-checkboxes'>
								<BaseControl.VisualLabel>
									{__('Restriction method', 'arkhe-blocks')}
								</BaseControl.VisualLabel>
								<ButtonGroup className='arkb-btns--limtPageType'>
									<Button
										text={__('Page Type', 'arkhe-blocks')}
										icon={pages}
										isPrimary={'page_type' === pageLimitType}
										onClick={() => {
											if ('page_type' !== pageLimitType) {
												setAttributes({ pageLimitType: 'page_type' });
											}
										}}
									/>
									<Button
										text={__('Terms', 'arkhe-blocks')}
										icon={file}
										isPrimary={'terms' === pageLimitType}
										onClick={() => {
											if ('terms' !== pageLimitType) {
												setAttributes({ pageLimitType: 'terms' });
											}
										}}
									/>
								</ButtonGroup>
							</BaseControl>
							{'page_type' === pageLimitType && (
								<>
									<BaseControl className='arkb-checkboxes'>
										{PAGE_TYPES.map((_target) => {
											return (
												<CheckboxControl
													label={_target.label}
													key={`key_${_target.value}`}
													checked={pageTypes[_target.value]}
													onChange={(val) => {
														setAttributes({
															pageTypes: {
																...pageTypes,
																[_target.value]: val,
															},
														});
													}}
												/>
											);
										})}
									</BaseControl>
									<div
										data-ark-disabled={!pageTypes.singular || null}
										style={{ marginTop: '-8px' }}
									>
										<SelectControl
											label={__('Types of Singular pages', 'arkhe-blocks')}
											value={allowedPostTypes.split(',')}
											options={[
												{
													label: __('All post types', 'arkhe-blocks'),
													value: '',
												},
												...postTypeList,
											]}
											multiple={true}
											onChange={(val) => {
												const types = val.join(',');
												setAttributes({
													allowedPostTypes: types.replace(/^,/, ''),
												});
											}}
										/>
										<ArkbHelpTip type='multiple-select' />
									</div>
								</>
							)}
							{'terms' === pageLimitType && (
								<>
									<BaseControl className='arkb-checkboxes'>
										<CheckboxControl
											label={
												<>{__('Target Archive pages', 'arkhe-blocks')}</>
											}
											checked={terms.isArchive}
											onChange={(val) => {
												setTermsOptions({ isArchive: val });
											}}
											className='has-helptip'
											help={
												<ArkbHelpTip
													tag='span'
													text={__(
														'Displays content on Term Archive pages that match the specified criteria.',
														'arkhe-blocks'
													)}
												/>
											}
										/>
										<CheckboxControl
											label={__('Target Singular pages', 'arkhe-blocks')}
											checked={terms.isSingular}
											onChange={(val) => {
												setTermsOptions({ isSingular: val });
											}}
											className='has-helptip'
											help={
												<ArkbHelpTip
													tag='span'
													text={__(
														'Displays content on Singular pages with terms that match the specified criteria.',
														'arkhe-blocks'
													)}
												/>
											}
										/>
									</BaseControl>

									<div
										data-ark-disabled={
											(!terms.isArchive && !terms.isSingular) || null
										}
									>
										<hr style={{ borderBottomStyle: 'dashed' }} />
										<ArkbTermPickers
											attrs={terms}
											setOptions={setTermsOptions}
											type={terms.isArchive ? 'archive' : ''}
										/>
									</div>
								</>
							)}
						</>
					)}
				</PanelBody>
			</InspectorControls>
		</>
	);
};
