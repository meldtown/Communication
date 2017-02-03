import * as actions from '../constants'
import * as ko from 'knockout'
import axios from 'axios'
import 'babel-polyfill'
import './EmployerHub.scss'
import '../bindingHandlers/hasFocus'
import '../bindingHandlers/enterPress'
import '../bindingHandlers/attach'
import ConversationList from '../Conversation/ConversationList'
import MessageList from '../Message/MessageList'
import StandardMessageForm from '../Message/Form/StandardMessageForm'
import InviteMessageForm from '../Message/Form/InviteMessageForm'
import DeclineMessageForm from '../Message/Form/DeclineMessageForm'
import OfferMessageForm from '../Message/Form/OfferMessageForm'
import '../customBindings/googleMap'
import '../customBindings/addressAutocomplete'
import '../customBindings/perfectScroll'

// Remove after changing observable isInviteFormAvailable
import OfferMessage from '../Message/OfferMessage'
import ApplyMessage from '../Message/ApplyMessage'

export default class EmployerHub {
	constructor(dispatcher) {
		if (!ko.isSubscribable(dispatcher)) {
			throw new Error('ko.subscribable is required')
		}

		this.dispatcher = dispatcher
		this.conversations = new ConversationList(dispatcher)
		this.messages = new MessageList(dispatcher)

		this.standardMessageForm = new StandardMessageForm(dispatcher)
		this.inviteMessageForm = new InviteMessageForm(dispatcher)
		this.declineMessageForm = new DeclineMessageForm(dispatcher)
		this.offerMessageForm = new OfferMessageForm(dispatcher)

		this.selectedForm = ko.observable(this.standardMessageForm)

		this.isStandardFormSelected = ko.computed(() => this.selectedForm() === this.standardMessageForm)
		this.isInviteFormSelected = ko.computed(() => this.selectedForm() === this.inviteMessageForm)
		this.isDeclineFormSelected = ko.computed(() => this.selectedForm() === this.declineMessageForm)
		this.isOfferFormSelected = ko.computed(() => this.selectedForm() === this.offerMessageForm)

		this.isInviteFormAvailable = ko.computed(() => {
			// init after isRead() implementation
			// return this.messages.messages().some(message => message.isRead())

			// remove after isRead() implementation
			return this.messages.messages().some(message => message instanceof OfferMessage || message instanceof ApplyMessage)
		})

		this.isDeclineFormAvailable = ko.computed(() => {
			return this.messages.messages().some(message => message instanceof ApplyMessage)
		})

		this.selectedConversation = ko.computed(() => this.conversations.selectedConversation())

		dispatcher.subscribe(({chatId, headId}) => {
			this.messages.chatId(chatId)
			this.messages.headId(headId)
			this.messages.fetch()
			this.selectedForm(this.standardMessageForm)
		}, this, actions.CONVERSATION_SELECTED)

		this.conversations.hasConversations.subscribe(hasConversations => {
			if (!hasConversations) {
				this.messages.chatId(null)
				this.messages.headId(null)

				this.standardMessageForm.chatId(null)
				this.inviteMessageForm.chatId(null)
				this.declineMessageForm.chatId(null)
				this.offerMessageForm.chatId(null)

				this.standardMessageForm.headId(null)
				this.inviteMessageForm.headId(null)
				this.declineMessageForm.headId(null)
				this.offerMessageForm.headId(null)

				this.messages.messages([])
			}
		})

		this.messages.messages.subscribe(messages => {
			this.inviteMessageForm.messages(messages)
			this.offerMessageForm.messages(messages)
			this.declineMessageForm.messages(messages)
		})
	}

	fetch() {
		return this.conversations.fetch()
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

	fetchVacancies() {
		return axios.get(`${api2}/employer/vacancylist`)
			.then(response => {
				this.inviteMessageForm.vacancies(response.data)
				this.offerMessageForm.vacancies(response.data)
			})
	}
}
