import * as ko from 'knockout'
import $ from 'jquery'
import './Conversation.scss'
import Conversation from './Conversation'
import * as types from '../constants'
import moment from 'moment'

export default class ConversationList {
	constructor(dispatcher) {
		if (!ko.isSubscribable(dispatcher)) {
			throw new Error('ko.subscribable is required')
		}

		this.dispatcher = dispatcher
		this.conversations = ko.observableArray()

		this.term = ko.observable()
		this.selectedType = ko.observable(types.ACTIVE_CONVERSATION)

		this.hasInvitesSelected = ko.observable()
		this.hasDeclinesSelected = ko.observable()
		this.hasOffersSelected = ko.observable()

		this.fromCvdbSelected = ko.observable()
		this.fromApplySelected = ko.observable()

		this.periodFrom = ko.observable()
		this.weekAgo = ko.computed(() => moment().subtract(1, 'week').format())
		this.monthAgo = ko.computed(() => moment().subtract(1, 'month').format())
		this.periodFromInputFormatted = ko.computed({
			read: () => this.periodFrom() ? moment(this.periodFrom()).format('YYYY-MM-DD') : '',
			write: date => this.periodFrom(date)
		})

		this.isActiveSelected = ko.computed(() => this.selectedType() === types.ACTIVE_CONVERSATION)
		this.isArchiveSelected = ko.computed(() => this.selectedType() === types.ARCHIVED_CONVERSATION)
		this.isBlockedSelected = ko.computed(() => this.selectedType() === types.BLOCKED_CONVERSATION)

		this.selectedConversation = ko.computed(() => this.conversations().filter(conversation => conversation.isSelected())[0])

		this.filteredConversations = ko.computed(() => {
			return this.conversations()
				.filter(conversation => {
					if (!this.hasInvitesSelected() && !this.hasDeclinesSelected() && !this.hasOffersSelected()) return true

					return this.hasInvitesSelected() && conversation.hasInvites()
						|| this.hasDeclinesSelected() && conversation.hasDeclines()
						|| this.hasOffersSelected() && conversation.hasOffers()
				})
				.filter(conversation => {
					if (!this.fromCvdbSelected() && !this.fromApplySelected()) return true
					return this.fromCvdbSelected() && conversation.fromCvdb()
						|| this.fromApplySelected() && conversation.fromApply()
				})
				.filter(conversation => {
					if (!this.periodFrom()) return true
					return moment(conversation.lastMessage().date()).isAfter(this.periodFrom())
				})
		})

		this.filteredConversations.subscribe(conversations => {
			if (conversations && conversations.length > 0) {
				conversations[0].select()
			}
		})
	}

	fetch() {
		let request = {type: this.selectedType()}

		if (this.term()) {
			request.q = this.term()
		}

		return $.getJSON(`${api}/conversations`, request)
			.done(conversations => {
				this.hasInvitesSelected(false)
				this.hasDeclinesSelected(false)
				this.hasOffersSelected(false)

				this.fromCvdbSelected(false)
				this.fromApplySelected(false)

				this.conversations(conversations.map(data => new Conversation(this.dispatcher, data)))
			})
			.fail(() => {
				this.conversations([])
			})
	}

	selectActive() {
		this.selectedType(types.ACTIVE_CONVERSATION)
		return this.fetch()
	}

	selectArchive() {
		this.selectedType(types.ARCHIVED_CONVERSATION)
		return this.fetch()
	}

	selectBlocked() {
		this.selectedType(types.BLOCKED_CONVERSATION)
		return this.fetch()
	}
}
