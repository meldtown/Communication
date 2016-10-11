import $ from 'jquery'
import * as ko from 'knockout'
import './Hub.scss'
import '../bindingHandlers/hasFocus'
import Conversation from '../Conversation/ConversationList'
import MessageList from '../Message/MessageList'

export default class Hub {
	constructor() {
		this.conversations = ko.observableArray()
		this.selectedConversation = ko.observable()
		this.messageList = new MessageList(this)

		this.a = ko.observable()
		this.b = ko.observable()
		this.numericA = ko.computed(() => isNaN(parseInt(this.a())) ? 0 : parseInt(this.a()))
		this.numericB = ko.computed(() => isNaN(parseInt(this.b())) ? 0 : parseInt(this.b()))
		this.aHasFocus = ko.observable()
		this.sum = ko.computed(() => this.numericA() + this.numericB())

		this.fetchConversations()
		this.selectedConversation.subscribe(newConversation => this.messageList.fetchMessages(newConversation.id))
	}

	fetchConversations() {
		$.getJSON(`${api}/conversations`)
			.then(conversations => {
				let items = conversations.map(conversation => new Conversation(this, conversation))
				this.conversations(items)
				this.selectedConversation(items[0])
				this.messageList.fetchMessages(items[0].id)
			})
	}

	fetch() {
		return $.getJSON(`${api}/conversations`)
			.then(conversations => {
				this.a(conversations.length / 2)
				this.b(conversations.length / 2)
			})
			.fail(() => {
				this.a(1)
				this.b(1)
			})
	}
}
