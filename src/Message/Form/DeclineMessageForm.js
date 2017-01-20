import AbstractMessageForm from './AbstractMessageForm'
import MessageFactory from '../MessageFactory'
import axios from 'axios'
import * as constants from '../../constants'

export default class DeclineMessageForm extends AbstractMessageForm {
	constructor(dispatcher) {
		super(dispatcher)
		this.template('DeclineMessageForm')
	}

	save() {
		if (!this.chatId()) {
			throw new Error('chatId is required')
		}

		return axios.post(`${api}/messages`, {
			type: constants.DECLINE_MESSAGE,
			chatId: this.chatId(),
			text: this.text()
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
