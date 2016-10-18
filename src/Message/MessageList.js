import * as ko from 'knockout'
import $ from 'jquery'
import MessageFactory from './MessageFactory'

export default class MessageList {
	constructor(dispatcher) {
		if (!ko.isSubscribable(dispatcher)) {
			throw new Error('ko.subscribable is required')
		}

		this.dispatcher = dispatcher

		this.conversationId = ko.observable()
		this.messages = ko.observableArray()
	}

	fetch() {
		return $.getJSON(`${api}/messages`, {conversationId: this.conversationId()})
			.then(messages => this.messages(messages.map(MessageFactory.create)))
			.fail(() => this.messages([]))
	}
}
