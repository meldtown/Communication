import * as actions from '../actions'
import * as ko from 'knockout'
import './Hub.scss'
import '../bindingHandlers/hasFocus'
import ConversationList from '../Conversation/ConversationList'
import MessageList from '../Message/MessageList'
import StandardMessageForm from '../Message/Form/StandardMessageForm'
import InviteMessageForm from '../Message/Form/InviteMessageForm'
import DeclineMessageForm from '../Message/Form/DeclineMessageForm'
import OfferMessageForm from '../Message/Form/OfferMessageForm'

export default class Hub {
	constructor(dispatcher) {
		if (!ko.isSubscribable(dispatcher)) {
			throw new Error('ko.subscribable is required')
		}

		this.dispatcher = dispatcher
		this.conversations = new ConversationList(dispatcher)
		this.messages = new MessageList()

		this.standardMessageForm = new StandardMessageForm()
		this.inviteMessageForm = new InviteMessageForm()
		this.declineMessageForm = new DeclineMessageForm()
		this.offerMessageForm = new OfferMessageForm()

		this.selectedForm = ko.observable(StandardMessageForm)

		this.isStandardFormSelected = ko.computed(() => this.selectedForm() === StandardMessageForm)
		this.isInviteFormSelected = ko.computed(() => this.selectedForm() === InviteMessageForm)
		this.isDeclineFormSelected = ko.computed(() => this.selectedForm() === DeclineMessageForm)
		this.isOfferFormSelected = ko.computed(() => this.selectedForm() === OfferMessageForm)

		dispatcher.subscribe(conversationId => {
			this.messages.fetch(conversationId)
		}, this, actions.CONVERSATION_SELECTED)
	}

	fetch() {
		return this.conversations.fetch()
	}

	selectStandardForm() {
		this.selectedForm(StandardMessageForm)
	}

	selectInviteForm() {
		this.selectedForm(InviteMessageForm)
	}

	selectDeclineForm() {
		this.selectedForm(DeclineMessageForm)
	}

	selectOfferForm() {
		this.selectedForm(OfferMessageForm)
	}
}
