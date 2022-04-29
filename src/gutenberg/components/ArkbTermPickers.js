/**
 * @WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import { useEffect } from '@wordpress/element';

import {
	SelectControl,
	BaseControl,
	CheckboxControl,
	Button,
	TreeSelect,
	ButtonGroup,
	TabPanel,
} from '@wordpress/components';

import { Icon, file, tag, box } from '@wordpress/icons';

/**
 * @Internal dependencies
 */
import buildTermsTree from '@helper/buildTermsTree';
import { getCustomTaxonomies } from '@helper/get_core_data';
import ArkbHelpTip from '@components/ArkbHelpTip';

/**
 * タームの relationを選択するボタン
 */
const TermRelationBtns = ({ ids, relation, attr, setOptions, forArchive = false }) => {
	const isThreeBtns = !forArchive && 1 < ids.length;

	useEffect(() => {
		if (!isThreeBtns && 'AND' === relation) {
			setOptions({ [attr]: 'IN' });
		}
	}, [isThreeBtns, relation]);

	const helpText = isThreeBtns ? (
		<>
			{'IN: ' + __('Matches any one', 'arkhe-blocks')}
			<br />
			{'AND: ' + __('Matches all', 'arkhe-blocks')}
			<br />
			{'NOT IN: ' + __('Not matching', 'arkhe-blocks')}
		</>
	) : (
		<>
			{'IN: ' + __('Matches', 'arkhe-blocks')}
			<br />
			{'NOT IN: ' + __('Not matching', 'arkhe-blocks')}
		</>
	);

	return (
		<>
			<ButtonGroup className='arkb-btns--small arkb-btns--logicalRelation'>
				{isThreeBtns ? (
					<>
						<Button
							text='IN'
							isPrimary={'IN' === relation}
							onClick={() => {
								setOptions({ [attr]: 'IN' });
							}}
						/>
						<Button
							text='AND'
							isPrimary={'AND' === relation}
							onClick={() => {
								setOptions({ [attr]: 'AND' });
							}}
						/>
						<Button
							text='NOT IN'
							isPrimary={'NOT IN' === relation}
							onClick={() => {
								setOptions({ [attr]: 'NOT IN' });
							}}
						/>
					</>
				) : (
					<>
						<Button
							text='IN'
							isPrimary={'NOT IN' !== relation}
							onClick={() => {
								setOptions({ [attr]: 'IN' });
							}}
						/>
						<Button
							text='NOT IN'
							isPrimary={'NOT IN' === relation}
							onClick={() => {
								setOptions({ [attr]: 'NOT IN' });
							}}
						/>
					</>
				)}
			</ButtonGroup>
			<ArkbHelpTip text={helpText} />
		</>
	);
};

/**
 * export
 */
const ArkbTermPickers = ({ setOptions, attrs, type = '' }) => {
	const {
		catID,
		tagID,
		taxName,
		termID,
		catRelation,
		tagRelation,
		termRelation,
		queryRelation,
		exCatChildren,
	} = attrs;

	const forArchive = 'archive' === type;

	// 全タクソノミーを取得
	const taxonomyList = getCustomTaxonomies() || [];

	const termData = useSelect(
		(select) =>
			select('core').getEntityRecords('taxonomy', taxName, {
				per_page: -1,
			}),
		[taxName]
	);

	// タームリスト
	const categoryData = useSelect((select) =>
		select('core').getEntityRecords('taxonomy', 'category', {
			per_page: -1,
		})
	);
	const tagData = useSelect((select) =>
		select('core').getEntityRecords('taxonomy', 'post_tag', {
			per_page: -1,
		})
	);

	// 初期で開くタブをどれにするか
	let initialTabName = 'category';
	if (!catID && tagID) {
		initialTabName = 'tag';
	}
	if (!catID && !tagID && termID) {
		initialTabName = 'taxonomy';
	}

	// 各ID指定を配列化
	const catIDs = catID.split(',');
	const tagIDs = tagID.split(',');
	const termIDs = termID.split(',');

	const catSetting = (
		<>
			<TreeSelect
				className='arkb-tree-select -category'
				noOptionLabel='----'
				onChange={(val) => {
					const IDsStr = val.join(',');
					setOptions({ catID: IDsStr.replace(/^,/, '') });
				}}
				selectedId={catIDs}
				tree={buildTermsTree(categoryData)}
				multiple
			/>
			<ArkbHelpTip type='multiple-select' />
			{'query' === type && (
				<CheckboxControl
					className='arkb-check--exCatChild'
					label={__('Exclude articles in child categories only', 'arkhe-blocks')}
					checked={exCatChildren}
					onChange={(checked) => {
						setOptions({ exCatChildren: checked });
					}}
				/>
			)}

			<div data-ark-disabled={!catID || null}>
				<BaseControl className='arkb-btns--relation'>
					<BaseControl.VisualLabel>
						{__('The logical relationship of selected terms', 'arkhe-blocks')}
					</BaseControl.VisualLabel>
					<TermRelationBtns
						ids={catIDs}
						attr={'catRelation'}
						relation={catRelation}
						setOptions={setOptions}
						forArchive={forArchive}
					/>
				</BaseControl>
			</div>
		</>
	);

	const tagSetting = (
		<>
			<TreeSelect
				className='arkb-tree-select -tag'
				noOptionLabel='----'
				onChange={(val) => {
					const IDsStr = val.join(',');
					setOptions({ tagID: IDsStr.replace(/^,/, '') });
				}}
				selectedId={tagIDs}
				tree={buildTermsTree(tagData)}
				multiple
			/>
			<ArkbHelpTip type='multiple-select' />
			<div data-ark-disabled={!tagID || null}>
				<BaseControl className='arkb-btns--relation'>
					<BaseControl.VisualLabel>
						{__('The logical relationship of selected terms', 'arkhe-blocks')}
					</BaseControl.VisualLabel>
					<TermRelationBtns
						ids={tagIDs}
						attr={'tagRelation'}
						relation={tagRelation}
						setOptions={setOptions}
						forArchive={forArchive}
					/>
				</BaseControl>
			</div>
		</>
	);

	const taxSetting =
		0 < taxonomyList.length ? (
			<>
				<SelectControl
					value={taxName}
					options={[{ label: '---', value: '' }, ...taxonomyList]}
					onChange={(val) => {
						setOptions({ taxName: val });
					}}
				/>
				{taxName && (
					<>
						<TreeSelect
							label={__('Terms', 'arkhe-blocks')}
							className='arkb-tree-select -term'
							noOptionLabel='----'
							onChange={(val) => {
								const IDsStr = val.join(',');
								setOptions({ termID: IDsStr.replace(/^,/, '') });
							}}
							selectedId={termIDs}
							tree={buildTermsTree(termData)}
							multiple
						/>
						<ArkbHelpTip type='multiple-select' />
						<div data-ark-disabled={!termID || null}>
							<BaseControl className='arkb-btns--relation'>
								<BaseControl.VisualLabel>
									{__(
										'The logical relationship of selected terms',
										'arkhe-blocks'
									)}
								</BaseControl.VisualLabel>
								<TermRelationBtns
									ids={termIDs}
									attr={'termRelation'}
									relation={termRelation}
									setOptions={setOptions}
									forArchive={forArchive}
								/>
							</BaseControl>
						</div>
					</>
				)}
			</>
		) : (
			<p>{__('There are no taxonomies available for selection.', 'arkhe-blocks')}</p>
		);

	return (
		<>
			{/* <hr /> */}
			<TabPanel
				className='arkb-tabPanel -terms'
				activeClass='is-active'
				tabs={[
					{
						name: 'category',
						title: (
							<>
								<Icon icon={file} />
								<span>{__('Categories', 'arkhe-blocks')}</span>
							</>
						),
						className: 'arkb-tabPanel__menu -category',
					},
					{
						name: 'tag',
						title: (
							<>
								<Icon icon={tag} />
								<span>{__('Tags', 'arkhe-blocks')}</span>
							</>
						),
						className: 'arkb-tabPanel__menu -tag',
					},
					{
						name: 'taxonomy',
						title: (
							<>
								<Icon icon={box} />
								<span>{__('Taxonomy', 'arkhe-blocks')}</span>
							</>
						),
						className: 'arkb-tabPanel__menu -taxonomy',
					},
				]}
				initialTabName={initialTabName}
			>
				{(tab) => {
					if ('category' === tab.name) {
						return catSetting;
					} else if ('tag' === tab.name) {
						return tagSetting;
					} else if ('taxonomy' === tab.name) {
						return taxSetting;
					}
				}}
			</TabPanel>
			<hr style={{ borderBottomStyle: 'dashed' }} />
			<div data-ark-disabled={forArchive || null}>
				<SelectControl
					label={__('The relationship between each Taxonomy condition', 'arkhe-blocks')}
					value={queryRelation}
					options={[
						{
							// 'どれか1つでも条件に合うかどうか'
							label: __('Whether any one meets the conditions', 'arkhe-blocks'),
							value: 'OR',
						},
						{
							// '全ての条件に合うかどうか'
							label: __('Whether all conditions are met', 'arkhe-blocks'),
							value: 'AND',
						},
					]}
					onChange={(val) => {
						setOptions({ queryRelation: val });
					}}
					help={
						forArchive
							? __('Valid only when judging on Singular pages', 'arkhe-blocks')
							: null
					}
				/>
			</div>
		</>
	);
};
export default ArkbTermPickers;
