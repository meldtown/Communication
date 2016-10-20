import * as ko from 'knockout'
import MessageList from '../Message/MessageList'
import StandardMessageForm from '../Message/Form/StandardMessageForm'
import InviteMessageForm from '../Message/Form/InviteMessageForm'
import DeclineMessageForm from '../Message/Form/DeclineMessageForm'
import OfferMessageForm from '../Message/Form/OfferMessageForm'

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

		this.standardMessageForm = new StandardMessageForm(dispatcher)
		this.inviteMessageForm = new InviteMessageForm(dispatcher)
		this.declineMessageForm = new DeclineMessageForm(dispatcher)
		this.offerMessageForm = new OfferMessageForm(dispatcher)

		this.standardMessageForm.conversationId(conversationId)
		this.inviteMessageForm.conversationId(conversationId)
		this.declineMessageForm.conversationId(conversationId)
		this.offerMessageForm.conversationId(conversationId)

		this.selectedForm = ko.observable(this.standardMessageForm)

		this.isStandardFormSelected = ko.computed(() => this.selectedForm() === this.standardMessageForm)
		this.isInviteFormSelected = ko.computed(() => this.selectedForm() === this.inviteMessageForm)
		this.isDeclineFormSelected = ko.computed(() => this.selectedForm() === this.declineMessageForm)
		this.isOfferFormSelected = ko.computed(() => this.selectedForm() === this.offerMessageForm)

		this.conversationId.subscribe(conversationId => {
			this.messages.conversationId(conversationId)
			this.standardMessageForm.conversationId(conversationId)
			this.inviteMessageForm.conversationId(conversationId)
			this.declineMessageForm.conversationId(conversationId)
			this.offerMessageForm.conversationId(conversationId)
			this.fetch()
		})
	}

	fetch() {
		return this.messages.fetch()
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
