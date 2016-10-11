import $ from 'jquery'
import * as ko from 'knockout'
import MessageListItem from './MessageListItem'

export default class MessageList {
	constructor() {
		this.messages = ko.observableArray();
	}

	fetchMessages(conversationId) {
		$.getJSON(`${api}/messages?conversationId=${conversationId}`)
			.then(messages => {
				this.messages(messages.map(message => new MessageListItem(message)))
			})
	}
}
