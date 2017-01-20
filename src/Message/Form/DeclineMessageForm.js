import AbstractMessageForm from './AbstractMessageForm'
import MessageFactory from '../MessageFactory'
import axios from 'axios'
import * as constants from '../../constants'
import Attach from '../../Attach/Attach'

export default class DeclineMessageForm extends AbstractMessageForm {
	constructor(dispatcher) {
		super(dispatcher)
		this.template('DeclineMessageForm')
	}

	save() {
		if (!this.chatId()) {
			throw new Error('chatId is required')
		}

		return axios.post(`${api2}/messages/hubmessage`, {
			typeId: constants.DECLINE_MESSAGE,
			chatId: this.chatId(),
			headId: this.headId(),
			attachId: this.attach().id,
			attach: this.attach(),
			text: this.text()
		}).then(response => {
			if (this.reset) {
				this.reset()
			}

			this.attach(new Attach())

			let message = MessageFactory.create(response.data)

			this.dispatcher.notifySubscribers(message, constants.NEW_MESSAGE)

			return message
		})
	}

	reset() {
		this.text('')
	}
}
