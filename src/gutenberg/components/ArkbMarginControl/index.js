/**
 * @wordpress
 */
import { __ } from '@wordpress/i18n';
import { memo } from '@wordpress/element';
import { ToolbarGroup } from '@wordpress/components';

/**
 * @Internal dependencies
 */
import icons from './icon';
import hasClass from '@helper/hasClass';
import setClass from '@helper/setClass';

/**
 * 設定項目
 */
const MT_OPTIONS = [
	{
		icon: <span className='arkb-null-icon'></span>,
		size: '0',
		title: '0',
		mbClass: 'u-mt-0',
	},
	{
		icon: <span className='arkb-null-icon'></span>,
		size: '0.5rem',
		title: '0.5rem',
		mbClass: 'u-mt-5',
	},
	{
		icon: <span className='arkb-null-icon'></span>,
		size: '1rem',
		title: '1rem',
		mbClass: 'u-mt-10',
	},
	{
		icon: <span className='arkb-null-icon'></span>,
		size: '1.5rem',
		title: '1.5rem',
		mbClass: 'u-mt-15',
	},
	{
		icon: <span className='arkb-null-icon'></span>,
		size: '2rem',
		title: '2rem',
		mbClass: 'u-mt-20',
	},
	{
		icon: <span className='arkb-null-icon'></span>,
		size: '3rem',
		title: '3rem',
		mbClass: 'u-mt-30',
	},
	{
		icon: <span className='arkb-null-icon'></span>,
		size: '4rem',
		title: '4rem',
		mbClass: 'u-mt-40',
	},
	// {
	// 	icon: <span className='arkb-null-icon'></span>,
	// 	size: '5rem',
	// 	title: '5rem',
	// 	mbClass: 'u-mt-50',
	// },
	{
		icon: <span className='arkb-null-icon'></span>,
		size: '6rem',
		title: '6rem',
		mbClass: 'u-mt-60',
	},
	{
		icon: <span className='arkb-null-icon'></span>,
		size: '8rem',
		title: '8rem',
		mbClass: 'u-mt-80',
	},
];

// 設定項目からクラス名だけを集めた配列を生成する
const MT_CLASS_GROUP = MT_OPTIONS.map((control) => {
	return control.mbClass;
});

/**
 * ArkbMarginControl
 */
export default memo(({ className, setAttributes }) => {
	// console.log('ArkheMarginControl');

	// テーマがArkheの時のみ有効
	// if (!window.arkheTheme) {
	// 	return null;
	// }

	const nowClass = className || '';

	// 現在アクティブなボタンを検出
	let activeBtn;
	MT_OPTIONS.forEach((control) => {
		if (hasClass(nowClass, control.mbClass)) {
			activeBtn = control;
		}
	});
	const activeClass = activeBtn ? activeBtn.mbClass : '';

	return (
		<ToolbarGroup
			className='arkb-toolbar'
			isCollapsed={true}
			icon={
				activeBtn ? (
					<span className='arkb-toolbtn--margin'>
						{icons.mbCtrolSeted}
						{activeBtn.size}
					</span>
				) : (
					icons.mbCtrol
				)
			}
			label={__('Margins on the block', 'arkhe-blocks')}
			controls={MT_OPTIONS.map((control) => {
				const { mbClass } = control; //mapでループ中のボタンのクラス
				const isActive = activeClass === mbClass;

				return {
					...control,
					isActive,
					onClick: () => {
						const newClass = setClass(nowClass, mbClass, MT_CLASS_GROUP);
						setAttributes({ className: newClass });
					},
				};
			})}
		/>
	);
});
