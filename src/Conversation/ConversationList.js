import * as ko from 'knockout'
import './Conversation.scss'

export default class ConversationList {
	constructor(root, data) {
		ko.utils.extend(this, data)

		this.root = root;

		this.dateHumanReadable = (new Date(this.date)).toLocaleString();

		this.isSelected = ko.computed(() => this === root.selectedConversation())
	}

	select() {
		this.root.selectedConversation(this)
	}
}
