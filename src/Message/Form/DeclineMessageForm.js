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
		if (!this.conversationId()) {
			throw new Error('conversationId is required')
		}

		return axios.post(`${api}/messages`, {
			type: constants.DECLINE_MESSAGE,
			conversationId: this.conversationId(),
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
