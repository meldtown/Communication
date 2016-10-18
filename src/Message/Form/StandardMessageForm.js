import * as actions from '../../actions'
import * as types from '../../types'
import $ from 'jquery'
import AbstractMessageForm from './AbstractMessageForm'
import MessageFactory from '../MessageFactory'

export default class StandardMessageForm extends AbstractMessageForm {
	save() {
		if (!this.conversationId()) {
			throw new Error('conversationId is required')
		}

		return $.post(`${api}/messages`, {
			type: types.STANDARD_MESSAGE,
			conversationId: this.conversationId(),
			text: this.text()
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
