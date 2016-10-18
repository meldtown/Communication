import * as constants from '../constants'
import * as ko from 'knockout'
import $ from 'jquery'
import MessageFactory from '../Message/MessageFactory'

export default class Conversation {
	constructor(dispatcher, {id, avatar, lastMessage, type, unreadMessagesCount} = {}) {
		if (!ko.isSubscribable(dispatcher)) {
			throw new Error('ko.subscribable is required')
		}

		this.dispatcher = dispatcher
		this.id = ko.observable(id)
		this.type = ko.observable(type)
		this.avatar = ko.observable(avatar)
		this.lastMessage = ko.observable(MessageFactory.create(lastMessage))
		this.unreadMessagesCount = ko.observable(unreadMessagesCount)

		this.isSelected = ko.observable(false)

		this.isActive = ko.computed(() => this.type() === constants.ACTIVE_CONVERSATION)
		this.isArchived = ko.computed(() => this.type() === constants.ARCHIVED_CONVERSATION)
		this.isBlocked = ko.computed(() => this.type() === constants.BLOCKED_CONVERSATION)

		dispatcher.subscribe(id => {
			this.isSelected(this.id() === id)
		}, this, constants.CONVERSATION_SELECTED)
	}

	select() {
		this.dispatcher.notifySubscribers(this.id(), constants.CONVERSATION_SELECTED)
	}

	block() {
		return $.ajax({
			type: 'put',
			url: `${api}/conversations/${this.id()}`,
			data: {type: constants.BLOCKED_CONVERSATION}
		}).then(data => {
			this.dispatcher.notifySubscribers(this, constants.CONVERSATION_BLOCKED)
			this.type(constants.BLOCKED_CONVERSATION)
			return data
		})
	}

	archive() {
		return $.ajax({
			type: 'PUT',
			url: `${api}/conversations/${this.id()}`,
			data: {type: constants.ARCHIVED_CONVERSATION}
		}).then(data => {
			this.type(constants.ARCHIVED_CONVERSATION)
			this.dispatcher.notifySubscribers(this, constants.CONVERSATION_ARCHIVED)
			return data
		})
	}

	activate() {
		return $.ajax({
			type: 'PUT',
			url: `${api}/conversations/${this.id()}`,
			data: {type: constants.ACTIVE_CONVERSATION}
		}).then(data => {
			this.type(constants.ACTIVE_CONVERSATION)
			this.dispatcher.notifySubscribers(this, constants.CONVERSATION_ACTIVATED)
			return data
		})
	}
}
