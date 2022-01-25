/**
 * @WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { __experimentalLinkControl as LinkControl } from '@wordpress/block-editor';
import { ToolbarButton, ToolbarGroup, Popover, TextControl } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { Icon, link, linkOff } from '@wordpress/icons';

/**
 * @Internal dependencies
 */
import getNewLinkRel from '@helper/getNewLinkRel';

export const ArkheLinkControl = ({
	attributes,
	setAttributes,
	isOpen,
	setIsOpen = null,
	useAriaLabel = false,
}) => {
	const { href, rel, isNewTab, ariaLabel } = attributes;

	let _isOpen;
	let _setIsOpen;

	if (null === setIsOpen) {
		[_isOpen, _setIsOpen] = useState(false);
	} else {
		_isOpen = isOpen;
		_setIsOpen = setIsOpen;
	}

	return (
		<>
			<ToolbarGroup>
				<ToolbarButton
					name='link'
					icon={<Icon icon={link} />}
					title={__('Link')}
					onClick={() => {
						_setIsOpen(true);
					}}
				/>
				{!!href && (
					<ToolbarButton
						className='components-toolbar__control'
						label={__('Delete link', 'arkhe-blocks')}
						icon={linkOff}
						isPressed
						onClick={() => {
							setAttributes({
								href: undefined,
								isNewTab: false,
								rel: undefined,
							});
						}}
					/>
				)}
			</ToolbarGroup>
			{/* リンク設定用のポップオーバー */}
			{_isOpen && (
				<Popover
					className='arkb-link-control'
					position='bottom center'
					onClose={() => _setIsOpen(false)}
				>
					<LinkControl
						value={{ url: href, opensInNewTab: isNewTab }}
						onChange={(changedVal) => {
							// console.log(changedVal);
							const { url = '', opensInNewTab } = changedVal;
							const newRel = getNewLinkRel(opensInNewTab, rel);

							setAttributes({
								href: url,
								isNewTab: opensInNewTab,
								rel: newRel,
							});
						}}
						// 5.9以降はこれで設定追加できる（~5.8のサポート廃止時に切り替える。）
						// renderControlBottom={() => {return <div>test</div>;}}
					/>

					<div className='block-editor-link-control -bottom'>
						<div className='block-editor-link-control__tools'>
							<div className='block-editor-link-control__settings'>
								<TextControl
									label={__('Link rel')}
									value={rel || ''}
									onChange={(value) => {
										setAttributes({ rel: value });
									}}
								/>
								{useAriaLabel && (
									<TextControl
										label='aria-label'
										value={ariaLabel}
										onChange={(newLabel) => {
											setAttributes({ ariaLabel: newLabel || undefined });
										}}
									/>
								)}
							</div>
						</div>
					</div>
				</Popover>
			)}
		</>
	);
};
