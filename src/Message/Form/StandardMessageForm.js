import * as actions from '../../constants'
import * as types from '../../constants'
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
			type: types.STANDARD_MESSAGE,
			conversationId: this.conversationId(),
			text: this.text(),
			avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/digitalmaverick/128.jpg'
		}).then(response => {
			if (this.reset) {
				this.reset()
			}

			let message = MessageFactory.create(response.data)

			this.dispatcher.notifySubscribers(message, actions.NEW_MESSAGE)

			return message
		})
	}

	reset() {
		this.text('')
	}
}
