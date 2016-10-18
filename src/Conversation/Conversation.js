import * as actions from '../constants'
import * as ko from 'knockout'

export default class Conversation {
	constructor(dispatcher, {id, avatar, lastMessage} = {}) {
		if (!ko.isSubscribable(dispatcher)) {
			throw new Error('ko.subscribable is required')
		}

		this.dispatcher = dispatcher
		this.id = ko.observable(id)
		this.avatar = ko.observable(avatar)
		this.lastMessage = ko.observable(lastMessage)

		this.isSelected = ko.observable(false)

		dispatcher.subscribe(id => {
			this.isSelected(this.id() === id)
		}, this, actions.CONVERSATION_SELECTED)
	}

	select() {
		this.dispatcher.notifySubscribers(this.id(), actions.CONVERSATION_SELECTED)
	}

}
