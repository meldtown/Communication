import * as constants from '../constants'
import * as ko from 'knockout'
import axios from 'axios'
import MessageFactory from '../Message/MessageFactory'


export default class Conversation {
	constructor(dispatcher, {id, avatar, lastMessage, type, unreadMessagesCount, fullName, vacancies, hasInvites, hasDeclines, hasOffers, fromCvdb, fromApply, headId} = {}) {
		if (!ko.isSubscribable(dispatcher)) {
			throw new Error('ko.subscribable is required')
		}

		this.dispatcher = dispatcher
		this.id = ko.observable(id)
		this.type = ko.observable(type)
		this.avatar = ko.observable(avatar)
		this.fullName = ko.observable(fullName)
		this.lastMessage = ko.observable(MessageFactory.create(lastMessage))
		this.unreadMessagesCount = ko.observable(unreadMessagesCount)
		this.vacancies = ko.observableArray(vacancies)
		this.hasInvites = ko.observable(hasInvites)
		this.hasDeclines = ko.observable(hasDeclines)
		this.hasOffers = ko.observable(hasOffers)
		this.fromCvdb = ko.observable(fromCvdb)
		this.fromApply = ko.observable(fromApply)
		this.headId = ko.observable(headId)

		this.isSelected = ko.observable(false)

		this.isActive = ko.computed(() => this.type() === constants.ACTIVE_CONVERSATION)
		this.isArchived = ko.computed(() => this.type() === constants.ARCHIVED_CONVERSATION)
		this.isBlocked = ko.computed(() => this.type() === constants.BLOCKED_CONVERSATION)

		this.unreadHighlight = ko.computed(() => {
			return (this.unreadMessagesCount() || this.isSelected()) && !(this.unreadMessagesCount() && !this.isSelected())
		})

		this.lastMessageTemplate = ko.computed(() => {
			return this.lastMessage()
				? `${this.lastMessage().template()}Preview`
				: null
		})

		dispatcher.subscribe(({chatId}) => {
			this.isSelected(this.id() === chatId)
		}, this, constants.CONVERSATION_SELECTED)
	}

	select() {
		this.dispatcher.notifySubscribers({chatId: this.id(), headId: this.headId()}, constants.CONVERSATION_SELECTED)
	}

	_changeType(targetType, eventToFire) {
		return axios.put(`${api2}/conversations/${this.id()}?type=${targetType}`).then(data => {
			this.dispatcher.notifySubscribers(this, eventToFire)
			this.type(targetType)
			return data
		})
	}

	block() {
		return this._changeType(constants.BLOCKED_CONVERSATION, constants.CONVERSATION_BLOCKED)
	}

	archive() {
		return this._changeType(constants.ARCHIVED_CONVERSATION, constants.CONVERSATION_ARCHIVED)
	}

	activate() {
		return this._changeType(constants.ACTIVE_CONVERSATION, constants.CONVERSATION_ACTIVATED)
	}
}
