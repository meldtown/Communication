import * as constants from '../constants'
import * as ko from 'knockout'
import $ from 'jquery'
import MessageFactory from '../Message/MessageFactory'

export default class Conversation {
	constructor(dispatcher, {id, avatar, lastMessage, type, unreadMessagesCount, fullName, vacancyIds, hasInvites, hasDeclines, hasOffers} = {}) {
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
		this.vacancyIds = ko.observableArray(vacancyIds)
		this.hasInvites = ko.observable(hasInvites)
		this.hasDeclines = ko.observable(hasDeclines)
		this.hasOffers = ko.observable(hasOffers)

		this.isSelected = ko.observable(false)

		this.isActive = ko.computed(() => this.type() === constants.ACTIVE_CONVERSATION)
		this.isArchived = ko.computed(() => this.type() === constants.ARCHIVED_CONVERSATION)
		this.isBlocked = ko.computed(() => this.type() === constants.BLOCKED_CONVERSATION)

		this.lastMessageTemplate = ko.computed(() => {
			return this.lastMessage()
				? `${this.lastMessage().template()}Preview`
				: null
		})

		dispatcher.subscribe(id => {
			this.isSelected(this.id() === id)
		}, this, constants.CONVERSATION_SELECTED)
	}

	select() {
		this.dispatcher.notifySubscribers(this.id(), constants.CONVERSATION_SELECTED)
	}

	_changeType(targetType, eventToFire) {
		return $.ajax({
			type: 'put',
			url: `${api}/conversations/${this.id()}`,
			data: {type: targetType}
		}).then(data => {
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
