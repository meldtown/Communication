import * as actions from '../../constants'
import * as ko from 'knockout'

export default class AbstractMessageForm {
	constructor(dispatcher) {
		if (!ko.isSubscribable(dispatcher)) {
			throw new Error('ko.subscribable is required')
		}

		this.dispatcher = dispatcher
		this.chatId = ko.observable()
		this.text = ko.observable()
		this.template = ko.observable()

		this.hasChatId = ko.computed(() => !!this.chatId())

		dispatcher.subscribe(chatId => {
			this.chatId(chatId)
			if (this.reset) {
				this.reset()
			}
		}, this, actions.CONVERSATION_SELECTED)
	}
}
