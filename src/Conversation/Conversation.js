import * as ko from 'knockout'
import './Conversation.scss'

export default class Conversation {
	constructor(parent, data) {
		ko.utils.extend(this, data)

		this.parent = parent;

		this.dateHumanReadable = (new Date(this.date)).toLocaleString();

		this.isSelected = ko.computed(() => this === parent.selectedConversation())
	}

	select() {
		this.parent.selectedConversation(this)
	}
}
