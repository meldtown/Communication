import './Accordion.scss'
import * as ko from 'knockout'
import MessageList from '../Message/MessageList'
import StandardMessageForm from '../Message/Form/StandardMessageForm'
import InviteMessageForm from '../Message/Form/InviteMessageForm'
import DeclineMessageForm from '../Message/Form/DeclineMessageForm'
import OfferMessageForm from '../Message/Form/OfferMessageForm'
import Conversation from '../Conversation/Conversation'
import axios from 'axios'

export default class Accordion {
	constructor(dispatcher, chatId) {
		if (!ko.isSubscribable(dispatcher)) {
			throw new Error('ko.subscribable is required')
		}

		if (!chatId) {
			throw new Error('chatId is required')
		}

		this.dispatcher = dispatcher
		this.chatId = ko.observable(chatId)
		this.conversation = ko.observable(new Conversation(dispatcher))
		this.messages = new MessageList(dispatcher)

		this.messages.chatId(chatId)

		this.standardMessageForm = new StandardMessageForm(dispatcher)
		this.inviteMessageForm = new InviteMessageForm(dispatcher)
		this.declineMessageForm = new DeclineMessageForm(dispatcher)
		this.offerMessageForm = new OfferMessageForm(dispatcher)

		this.standardMessageForm.chatId(chatId)
		this.inviteMessageForm.chatId(chatId)
		this.declineMessageForm.chatId(chatId)
		this.offerMessageForm.chatId(chatId)

		this.selectedForm = ko.observable(this.standardMessageForm)

		this.isStandardFormSelected = ko.computed(() => this.selectedForm() === this.standardMessageForm)
		this.isInviteFormSelected = ko.computed(() => this.selectedForm() === this.inviteMessageForm)
		this.isDeclineFormSelected = ko.computed(() => this.selectedForm() === this.declineMessageForm)
		this.isOfferFormSelected = ko.computed(() => this.selectedForm() === this.offerMessageForm)

		this.chatId.subscribe(chatId => {
			this.messages.chatId(chatId)
			this.standardMessageForm.chatId(chatId)
			this.inviteMessageForm.chatId(chatId)
			this.declineMessageForm.chatId(chatId)
			this.offerMessageForm.chatId(chatId)
			this.fetch()
		})
	}

	fetch() {
		return this.messages.fetch()
	}

	fetchConversation() {
		return axios.get(`${api}/conversations/${this.chatId()}`)
			.then(response => {
				let conversation = new Conversation(this.dispatcher, response.data)
				this.conversation(conversation)
				return conversation
			})
	}

	selectStandardForm() {
		this.selectedForm(this.standardMessageForm)
	}

	selectInviteForm() {
		this.selectedForm(this.inviteMessageForm)
	}

	selectDeclineForm() {
		this.selectedForm(this.declineMessageForm)
	}

	selectOfferForm() {
		this.selectedForm(this.offerMessageForm)
	}
}
