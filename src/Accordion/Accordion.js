import * as ko from 'knockout'
import MessageList from '../Message/MessageList'

export default class Accordion {
	constructor(dispatcher, conversationId) {
		if (!ko.isSubscribable(dispatcher)) {
			throw new Error('ko.subscribable is required')
		}

		if (!conversationId) {
			throw new Error('conversationId is required')
		}

		this.dispatcher = dispatcher
		this.conversationId = ko.observable(conversationId)
		this.messages = new MessageList(dispatcher)

		this.conversationId.subscribe(conversationId => {
			this.messages.conversationId(conversationId)
		})
	}

	fetch() {

	}
}
