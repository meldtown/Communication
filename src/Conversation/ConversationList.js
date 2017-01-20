import * as ko from 'knockout'
import axios from 'axios'
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

		this.selectedConversation = ko.computed(() => (this.conversations() || []).filter(conversation => conversation.isSelected())[0])

		this.hasTerm = ko.computed(() => this.term() && this.term().length > 0)
		this.hasConversations = ko.computed(() => this.conversations() && this.conversations().length > 0)

		this.vacancies = ko.computed(() => {
			if (!this.conversations()) return []

			return this.conversations()
				.map(conversation => conversation.vacancies())
				.reduce((result, vacancies) => result.concat(vacancies), [])
				.reduce((result, vacancy) => {
					if (!result.some(item => item.id === vacancy.id)) {
						result.push(vacancy)
					}

					return result
				}, [])
		})

		this.hasVacancies = ko.computed(() => this.vacancies().length > 0)

		this.unreadMessagesCount = ko.computed(() => (this.conversations() || []).map(c => c.unreadMessagesCount()).filter(c => c).reduce((a, b) => a + b, 0))

		this.vacancyId = ko.observable()

		this.filteredConversations = ko.computed(() => {
			return (this.conversations() || [])
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
				.filter(conversation => {
					if (!this.vacancyId()) return true
					return (conversation.vacancies() || []).some(v => v.id === this.vacancyId())
				})
		})

		this.filteredConversations.subscribe(conversations => {
			if (conversations && conversations.length > 0) {
				conversations[0].select()
			}
		})
	}

	fetch() {
		let request = {
			type: this.selectedType() || '',
			keywords: this.term() || ''
		}

		let queryString = ''
		queryString += Object.keys(request).map(key => request[key] ? `${key}=${request[key]}&` : '')

		return axios.get(`${api2}/conversations?${queryString}`)
			.then(response => {
				this.hasInvitesSelected(false)
				this.hasDeclinesSelected(false)
				this.hasOffersSelected(false)

				this.fromCvdbSelected(false)
				this.fromApplySelected(false)

				this.conversations(response.data.map(data => new Conversation(this.dispatcher, data)))
			})
			.catch(() => {
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

	clearTerm() {
		this.term('')
		this.fetch()
	}
}
