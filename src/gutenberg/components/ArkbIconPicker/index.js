/**
 * @WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { memo, useState } from '@wordpress/element';
import { Button, ButtonGroup, Popover, TextControl, TabPanel } from '@wordpress/components';
import { chevronDown } from '@wordpress/icons';

/**
 * @Inner dependencies
 */
import { faIcons, fiIcons, ioIcons, arkbIcons } from './IconList';
import ArkbIcon from '@components/ArkbIcon';

/**
 * ArkbIconPicker
 */
const ALL_ICONS = faIcons.concat(fiIcons, ioIcons, arkbIcons);

const ArkbIconPicker = memo(({ value, onChange, icons = null }) => {
	const [searchValue, setSearchValue] = useState('');
	const [isOpenIconPicker, setIsOpenIconPicker] = useState(false);

	let iconList = null;
	let filteredIcons = null;

	if (searchValue) {
		// 検索ワードからアイコンを絞り込みしているとき
		const allIcons = icons || ALL_ICONS;
		filteredIcons = allIcons.filter((i) => i.toLowerCase().includes(searchValue.toLowerCase()));
	} else if (icons) {
		// コンポーネントにiconsの指定があるとき
		filteredIcons = icons;
	}

	if (filteredIcons) {
		iconList = filteredIcons.length ? (
			<ButtonGroup>
				{filteredIcons.map((icon, idx) => {
					const isSelected = icon === value;
					return (
						<Button
							key={idx}
							isPrimary={isSelected}
							onClick={() => {
								const newIcon = isSelected ? '' : icon;
								onChange(newIcon);
							}}
						>
							<ArkbIcon icon={icon} size='20px' />
						</Button>
					);
				})}
			</ButtonGroup>
		) : (
			<div className='__noIcon'>{__('Icon not found.', 'arkhe-blocks')}</div>
		);
	} else {
		iconList = (
			<TabPanel
				className='arkb-iconPicker__tab'
				activeClass='is-active'
				tabs={[
					{
						name: 'ark',
						title: <ArkbIcon icon='arkb-svg-logo' />,
					},
					{
						name: 'io',
						title: <ArkbIcon icon='IoLogoIonic' />,
					},
					{
						name: 'fi',
						title: <ArkbIcon icon='FiFeather' />,
					},
					{
						name: 'fa',
						title: <ArkbIcon icon='fa-solid fa-font-awesome' />,
					},
				]}
				initialTabName='ark'
			>
				{(tab) => {
					if ('fa' === tab.name) {
						return (
							<ButtonGroup>
								{faIcons.map((icon, idx) => {
									return (
										<Button
											key={idx}
											isPrimary={icon === value}
											onClick={() => {
												onChange(icon);
											}}
										>
											<ArkbIcon icon={icon} size='20px' />
										</Button>
									);
								})}
							</ButtonGroup>
						);
					} else if ('io' === tab.name) {
						return (
							<ButtonGroup>
								{ioIcons.map((icon, idx) => {
									return (
										<Button
											key={idx}
											isPrimary={icon === value}
											onClick={() => {
												onChange(icon);
											}}
										>
											<ArkbIcon icon={icon} size='20px' />
										</Button>
									);
								})}
							</ButtonGroup>
						);
					} else if ('fi' === tab.name) {
						return (
							<ButtonGroup>
								{fiIcons.map((icon, idx) => {
									return (
										<Button
											key={idx}
											isPrimary={icon === value}
											onClick={() => {
												onChange(icon);
											}}
										>
											<ArkbIcon icon={icon} size='20px' />
										</Button>
									);
								})}
							</ButtonGroup>
						);
					} else if ('ark' === tab.name) {
						return (
							<ButtonGroup>
								{arkbIcons.map((icon, idx) => {
									return (
										<Button
											key={idx}
											isPrimary={icon === value}
											onClick={() => {
												onChange(icon);
											}}
										>
											<ArkbIcon icon={icon} size='20px' />
										</Button>
									);
								})}
							</ButtonGroup>
						);
					}
				}}
			</TabPanel>
		);
	}

	return (
		<div className='arkb-iconPicker'>
			<Button
				isSecondary
				icon={chevronDown}
				iconPosition='right'
				text={
					value ? (
						<ArkbIcon icon={value} size='24px' className='arkb-iconPicker__prev' />
					) : (
						<span className='arkb-iconPicker__placeholder'>
							{__('Search', 'arkhe-blocks')}
						</span>
					)
				}
				onClick={() => {
					setIsOpenIconPicker(true);
				}}
			/>
			{isOpenIconPicker && (
				<Popover
					className='arkb-iconPicker__popover'
					position='bottom'
					onClose={() => {
						setIsOpenIconPicker(false);
						setSearchValue('');
					}}
				>
					<TextControl
						placeholder={__('Search Icons', 'arkhe-blocks')}
						className='arkb-iconPicker__s'
						value={searchValue}
						// autoFocus={false}
						autoComplete='false'
						name='icon-search'
						onChange={(newSearchValue) => {
							setSearchValue(newSearchValue);
						}}
					/>
					<div className='arkb-iconPicker__list'>{iconList}</div>
				</Popover>
			)}
		</div>
	);
});

export default ArkbIconPicker;
