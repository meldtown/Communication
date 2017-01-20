import * as constants from '../../constants'
import axios from 'axios'
import AbstractMessageForm from './AbstractMessageForm'
import MessageFactory from '../MessageFactory'

export default class StandardMessageForm extends AbstractMessageForm {
	constructor(dispatcher) {
		super(dispatcher)
		this.template('StandardMessageForm')
	}

	save() {
		if (!this.chatId()) {
			throw new Error('chatId is required')
		}

		return axios.post(`${api2}/messages/hubmessage`, {
			typeId: constants.STANDARD_MESSAGE,
			chatId: this.chatId(),
			headId: this.headId(),
			text: this.text(),
			attach: this.attach()
		}).then(response => {
			if (this.reset) {
				this.reset()
			}

			let message = MessageFactory.create(response.data)

			this.dispatcher.notifySubscribers(message, constants.NEW_MESSAGE)

			return message
		})
	}

	reset() {
		this.text('')
	}
}
