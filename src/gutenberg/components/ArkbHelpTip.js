/**
 * @WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { createInterpolateElement } from '@wordpress/element';
import { Icon, help } from '@wordpress/icons';

/* eslint @wordpress/i18n-translator-comments:0 */
const multipleHelpText = createInterpolateElement(
	sprintf(
		__(
			'You can select multiple items by holding down the %1$s key on a Mac or the %2$s key on Windows.',
			'arkhe-blocks'
		),
		'<code>command</code>',
		'<code>ctrl</code>'
	),
	{
		code: <code />,
	}
);
const iconPickerHelpText = (
	<>
		{__('The following icons are available.', 'arkhe-blocks')}
		<ul>
			<li>
				<a
					href='https://fontawesome.com/search?m=free'
					target='_blank'
					rel='noopener noreferrer'
				>
					Font Awesome Free
				</a>
				<br />
				e.g.
				<code>fa-solid fa-font</code>
			</li>
			<li>
				<a
					href='https://react-icons.github.io/react-icons/icons?name=io5'
					target='_blank'
					rel='noopener noreferrer'
				>
					Ionicons v5
				</a>
				<br />
				e.g.
				<code>IoFontName</code>
			</li>
			<li>
				<a
					href='https://react-icons.github.io/react-icons/icons?name=fi'
					target='_blank'
					rel='noopener noreferrer'
				>
					Feather
				</a>
				<br />
				e.g.
				<code>FiFontName</code>
			</li>
		</ul>
		{__(
			'(The output is in svg, so no additional loading of css or js is required.)',
			'arkhe-blocks'
		)}
	</>
);

const ArkbHelpTip = ({ type = '', label = '', text = '', tag = 'div' }) => {
	let _label = '';
	let _text = '';
	if ('multiple-select' === type) {
		_label = __('Multiple choices', 'arkhe-blocks');
		_text = multipleHelpText;
	} else if ('icon-picker' === type) {
		_label = __('About available icon names', 'arkhe-blocks');
		_text = iconPickerHelpText;
	} else {
		_label = label;
		_text = text;
	}

	const Tag = tag;
	return (
		<Tag className='arkb-helpPopover'>
			{_label && <span className='arkb-helpPopover__label'>{_label}</span>}
			<Icon icon={help} size='20' className='arkb-helpPopover__icon' />
			<span className='arkb-helpPopover__desc'>{_text}</span>
		</Tag>
	);
};
export default ArkbHelpTip;
