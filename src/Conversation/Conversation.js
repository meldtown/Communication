import * as constants from '../constants'
import * as ko from 'knockout'
import $ from 'jquery'

export default class Conversation {
	constructor(dispatcher, {id, avatar, lastMessage, type} = {}) {
		if (!ko.isSubscribable(dispatcher)) {
			throw new Error('ko.subscribable is required')
		}

		this.dispatcher = dispatcher
		this.id = ko.observable(id)
		this.type = ko.observable(type)
		this.avatar = ko.observable(avatar)
		this.lastMessage = ko.observable(lastMessage)

		this.isSelected = ko.observable(false)

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
			return data
		})
	}
}
