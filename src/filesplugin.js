/*
 * Copyright (c) 2021 Julien Veyssier <eneiluj@posteo.net>
 *
 * This file is licensed under the Affero General Public License version 3
 * or later.
 *
 * See the COPYING-README file.
 *
 */
import { ApprovalInfoView } from './approvalinfoview'
import { states } from './states'

import { generateUrl } from '@nextcloud/router'
import axios from '@nextcloud/axios'

(function() {
	if (!OCA.Approval) {
		/**
		 * @namespace
		 */
		OCA.Approval = {}
	}

	/**
	 * @namespace
	 */
	OCA.Approval.FilesPlugin = {
		ignoreLists: [
			'trashbin',
			'files.public',
		],

		attach(fileList) {
			if (this.ignoreLists.indexOf(fileList.id) >= 0) {
				return
			}

			const approvalInfoView = new ApprovalInfoView()
			fileList.registerDetailView(approvalInfoView)
			OCA.Approval.View = approvalInfoView
		},
	}

})()

OC.Plugins.register('OCA.Files.FileList', OCA.Approval.FilesPlugin)

OCA.Files.fileActions.registerAction({
	name: 'LockingInline',
	async render(actionSpec, isDefault, context) {
		const fileId = context.$file[0].dataset.id
		const url = generateUrl('/apps/approval/' + fileId + '/state')
		try {
			const response = await axios.get(url)
			const state = response.data
			if (state !== states.NOTHING) {
				const actionLink = document.createElement('span')
				actionLink.classList.add('approval-inline-state')
				if (state === states.APPROVED) {
					actionLink.classList.add('icon-approved')
				} else if (state === states.REJECTED) {
					actionLink.classList.add('icon-rejected')
				} else {
					actionLink.classList.add('icon-pending')
				}
				context.$file.find('a.name>span.fileactions').append(actionLink)
				return actionLink
			}
		} catch (error) {
			console.error(error)
		}
		return null
	},
	mime: 'all',
	order: -140,
	type: OCA.Files.FileActions.TYPE_INLINE,
	permissions: OC.PERMISSION_READ,
	actionHandler: null,
})
