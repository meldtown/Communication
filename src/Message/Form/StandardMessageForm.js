import * as actions from '../../constants'
import * as types from '../../constants'
import $ from 'jquery'
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

		return $.post(`${api}/messages`, {
			type: types.STANDARD_MESSAGE,
			conversationId: this.conversationId(),
			text: this.text(),
			avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/digitalmaverick/128.jpg'
		}).then(data => {
			if (this.reset) {
				this.reset()
			}

			let message = MessageFactory.create(data)

			this.dispatcher.notifySubscribers(message, actions.NEW_MESSAGE)

			return message
		})
	}

	reset() {
		this.text('')
	}
}
