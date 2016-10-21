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
		if (!this.conversationId()) {
			throw new Error('conversationId is required')
		}

		return axios.post(`${api}/messages`, {
			type: constants.STANDARD_MESSAGE,
			conversationId: this.conversationId(),
			text: this.text(),
			avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/digitalmaverick/128.jpg'
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
