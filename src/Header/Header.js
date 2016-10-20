import './Header.scss'
import * as ko from 'knockout'
import ConversationList from '../Conversation/ConversationList'

export default class Header {
	constructor(dispatcher) {
		if (!ko.isSubscribable(dispatcher)) {
			throw new Error('ko.subscribable is required')
		}

		this.dispatcher = dispatcher
		this.conversations = new ConversationList(dispatcher)
	}

	fetch() {
		this.conversations.fetch()
	}
}
