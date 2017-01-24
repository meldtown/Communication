import * as constants from '../../constants'
import axios from 'axios'
import AbstractMessageForm from './AbstractMessageForm'
import MessageFactory from '../MessageFactory'
import Attach from '../../Attach/Attach'

export default class StandardMessageForm extends AbstractMessageForm {
	constructor(dispatcher) {
		super(dispatcher)
		this.template('StandardMessageForm')
	}

	save() {
		if (!this.headId()) {
			throw new Error('headId is required')
		}

		return axios.post(`${api2}/messages/hubmessage`, {
			typeId: constants.STANDARD_MESSAGE,
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
