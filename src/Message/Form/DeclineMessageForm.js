import AbstractMessageForm from './AbstractMessageForm'
import MessageFactory from '../MessageFactory'
import axios from 'axios'
import * as types from '../../constants'
import * as actions from '../../constants'

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
			type: types.DECLINE_MESSAGE,
			conversationId: this.conversationId(),
			text: this.text()
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
