import * as actions from '../actions'
import * as ko from 'knockout'
import './Hub.scss'
import '../bindingHandlers/hasFocus'
import ConversationList from '../Conversation/ConversationList'
import MessageList from '../Message/MessageList'
import StandardMessageForm from '../Message/Form/StandardMessageForm'

export default class Hub {
	constructor(dispatcher) {
		if (!ko.isSubscribable(dispatcher)) {
			throw new Error('ko.subscribable is required')
		}

		this.dispatcher = dispatcher
		this.conversations = new ConversationList(dispatcher)
		this.messages = new MessageList()

		this.standardMessageForm = new StandardMessageForm()

		dispatcher.subscribe(conversationId => {
			this.messages.fetch(conversationId)
		}, this, actions.CONVERSATION_SELECTED)
	}

	fetch() {
		return this.conversations.fetch()
	}
}
