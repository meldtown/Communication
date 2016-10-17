import * as ko from 'knockout'
import $ from 'jquery'
import MessageFactory from './MessageFactory'

export default class MessageList {
	constructor() {
		this.messages = ko.observableArray()
	}

	fetch(conversationId) {
		return $.getJSON(`${api}/messages`, {conversationId})
			.then(messages => this.messages(messages.map(MessageFactory.create)))
			.fail(() => this.messages([]))
	}
}
