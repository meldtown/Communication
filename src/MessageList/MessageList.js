import $ from 'jquery'
import * as ko from 'knockout'

export default class MessageList {
	constructor(parent) {
		this.parent = parent;
		this.messages = ko.observableArray();
	}

	fetchMessages(conversationId) {
		$.getJSON(`${api}/messages?conversationId=${conversationId}`)
			.then(messages => {
				this.messages(messages)
			})
	}
}
