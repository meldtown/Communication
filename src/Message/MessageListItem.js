import * as ko from 'knockout'

export default class MessageList {
	constructor(data) {
		ko.utils.extend(this, data)

		this.template = ko.computed(() => {
			switch (this.type) {
				case 'standard':
					return 'MessageListItemStandard'
				case 'invite':
					return 'MessageListItemInvite'
				case 'decline':
					return 'MessageListItemDecline'
				case 'response':
					return 'MessageListItemResponse'
				default:
					return 'MessageListItemStandard'
			}
		})
	}
}
