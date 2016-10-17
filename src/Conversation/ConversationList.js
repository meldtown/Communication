import * as ko from 'knockout'
import $ from 'jquery'
import './Conversation.scss'
import Conversation from './Conversation'

export default class ConversationList {
	constructor(dispatcher) {
		if (!ko.isSubscribable(dispatcher)) {
			throw new Error('ko.subscribable is required')
		}

		this.dispatcher = dispatcher
		this.conversations = ko.observableArray()
	}

	fetch() {
		return $.getJSON(`${api}/conversations`)
			.then(conversations => this.conversations(conversations.map(data => new Conversation(this.dispatcher, data))))
			.fail(() => this.conversations([]))
	}
}
