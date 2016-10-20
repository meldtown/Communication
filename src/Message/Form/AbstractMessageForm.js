import * as actions from '../../constants'
import * as ko from 'knockout'

export default class AbstractMessageForm {
	constructor(dispatcher) {
		if (!ko.isSubscribable(dispatcher)) {
			throw new Error('ko.subscribable is required')
		}

		this.dispatcher = dispatcher
		this.conversationId = ko.observable()
		this.text = ko.observable()
		this.template = ko.observable()

		this.hasConversationId = ko.computed(() => this.conversationId() ? true : false)

		dispatcher.subscribe(conversationId => {
			this.conversationId(conversationId)
			if (this.reset) {
				this.reset()
			}
		}, this, actions.CONVERSATION_SELECTED)
	}
}
