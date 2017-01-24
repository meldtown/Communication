import * as actions from '../../constants'
import * as ko from 'knockout'
import Attach from '../../Attach/Attach'


export default class AbstractMessageForm {
	constructor(dispatcher) {
		if (!ko.isSubscribable(dispatcher)) {
			throw new Error('ko.subscribable is required')
		}

		this.dispatcher = dispatcher
		this.chatId = ko.observable()
		this.text = ko.observable()
		this.template = ko.observable()
		this.headId = ko.observable()
		this.attach = ko.observable(new Attach())


		this.hasChatId = ko.computed(() => !!this.chatId())

		dispatcher.subscribe(({chatId, headId}) => {
			this.chatId(chatId)
			this.headId(headId)
			if (this.reset) {
				this.reset()
			}
		}, this, actions.CONVERSATION_SELECTED)
	}

	resetAttach() {
		this.attach(new Attach())
	}
}
