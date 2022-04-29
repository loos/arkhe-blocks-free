/**
 * @WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { ToolbarButton, ToolbarGroup, Popover, TextControl } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { Icon, link } from '@wordpress/icons';
import LinkControl from '@compatible/LinkControl';

/**
 * @Internal dependencies
 */
import getNewLinkRel from '@helper/getNewLinkRel';

const ArkbLinkControl = ({
	attrs,
	setLink,
	removeLink,
	setRel,
	isLinkOpen,
	setIsLinkOpen = null,
	setAriaLabel = null,
}) => {
	const { href, rel, isNewTab, ariaLabel } = attrs;

	let isOpen;
	let setIsOpen;

	if (null === setIsLinkOpen) {
		[isOpen, setIsOpen] = useState(false);
	} else {
		isOpen = isLinkOpen;
		setIsOpen = setIsLinkOpen;
	}

	const hasHref = !!href;

	return (
		<>
			<ToolbarGroup>
				<ToolbarButton
					name='link'
					icon={<Icon icon={link} />}
					title={__('Link')}
					onClick={() => {
						setIsOpen(true);
					}}
					isActive={hasHref}
				/>
			</ToolbarGroup>
			{isOpen && (
				<Popover
					className='arkb-link-control'
					position='bottom center'
					onClose={() => setIsOpen(false)}
				>
					<LinkControl
						value={{ url: href, opensInNewTab: isNewTab }}
						onChange={(changedVal) => {
							const { url = '', opensInNewTab } = changedVal;
							const newRel = getNewLinkRel(opensInNewTab, rel);
							setLink(url, opensInNewTab, newRel);
						}}
						onRemove={() => {
							removeLink();
							setIsOpen(false);
						}}
						forceIsEditingLink={!hasHref} // URLを編集モードにするかどうか

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
										setRel(value);
									}}
								/>
								{setAriaLabel && (
									<TextControl
										label='aria-label'
										value={ariaLabel || ''}
										onChange={(newLabel) => {
											setAriaLabel(newLabel);
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
export default ArkbLinkControl;
