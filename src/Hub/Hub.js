import * as ko from 'knockout'
import './Hub.scss'
import '../bindingHandlers/hasFocus'
import ConversationList from '../Conversation/ConversationList'

export default class Hub {
	constructor(dispatcher) {
		if (!ko.isSubscribable(dispatcher)) {
			throw new Error('ko.subscribable is required')
		}

		this.dispatcher = dispatcher
		this.conversations = new ConversationList(dispatcher)
	}
}
