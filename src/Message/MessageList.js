import * as actions from '../constants'
import * as ko from 'knockout'
import axios from 'axios'
import MessageFactory from './MessageFactory'

export default class MessageList {
	constructor(dispatcher) {
		if (!ko.isSubscribable(dispatcher)) {
			throw new Error('ko.subscribable is required')
		}

		this.dispatcher = dispatcher

		this.chatId = ko.observable()
		this.headId = ko.observable()
		this.messages = ko.observableArray()

		this.hasMessages = ko.computed(() => this.messages() && this.messages().length > 0)

		dispatcher.subscribe(message => {
			if (message.headId() === this.headId()) {
				this.messages.push(message)
			}
		}, this, actions.NEW_MESSAGE)
	}

	fetch() {
		return axios.get(`${api2}/conversations/${this.headId()}/messages`)
			.then(response => {
				this.messages(response.data.map(MessageFactory.create))
			})
			.catch(() => this.messages([]))
	}
}
