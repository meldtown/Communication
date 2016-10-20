import * as actions from '../constants'
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

		this.hasMessages = ko.computed(() => this.messages() && this.messages().length > 0)

		dispatcher.subscribe(message => {
			if (message.conversationId() === this.conversationId()) {
				this.messages.push(message)
			}
		}, this, actions.NEW_MESSAGE)
	}

	fetch() {
		return $.getJSON(`${api}/messages`, {conversationId: this.conversationId()})
			.then(messages => this.messages(messages.map(MessageFactory.create)))
			.fail(() => this.messages([]))
	}
}
