import * as actions from '../actions'
import * as ko from 'knockout'

export default class Conversation {
	constructor(dispatcher, {id, lastMessage} = {}) {
		if (!ko.isSubscribable(dispatcher)) {
			throw new Error('ko.subscribable is required')
		}

		this.dispatcher = dispatcher
		this.id = ko.observable(id)
		this.lastMessage = ko.observable(lastMessage)

		this.isSelected = ko.observable(false)

		dispatcher.subscribe(id => {
			this.isSelected(this.id() === id)
		}, this, actions.CONVERSATION_SELECTED)
	}
}
