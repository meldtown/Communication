import * as actions from '../../constants'
import * as ko from 'knockout'
import Attach from '../../Attach/Attach'
import axios from 'axios'

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
		axios.delete(`${api2}/attaches/${this.attach().id}`).then(() => {
			this.attach(new Attach())
		}).catch(() => {
			this.attach(new Attach())
		})
	}
}
