import * as actions from '../constants'
import * as ko from 'knockout'
import './JobsearcherHub.scss'
import MessageList from '../Message/MessageList'
import ConversationList from '../Conversation/ConversationList'
import StandardMessageForm from '../Message/Form/StandardMessageForm'

export default class JobsearcherHub {
	constructor(dispatcher) {
		if (!ko.isSubscribable(dispatcher)) {
			throw new Error('ko.subscribable is required')
		}

		this.dispatcher = dispatcher

		this.conversations = new ConversationList(dispatcher)
		this.messages = new MessageList(dispatcher)

		this.standardMessageForm = new StandardMessageForm(dispatcher)

		this.selectedConversation = ko.computed(() => this.conversations.selectedConversation())

		this.conversations.hasConversations.subscribe(hasConversations => {
			if (!hasConversations) {
				this.messages.chatId(null)
				this.standardMessageForm.chatId(null)
				this.messages.messages([])
			}
		})

		dispatcher.subscribe(({chatId, headId}) => {
			this.messages.chatId(chatId)
			this.messages.headId(headId)
			this.messages.fetch()
		}, this, actions.CONVERSATION_SELECTED)
	}

	fetch() {
		return this.conversations.fetch()
	}
}
