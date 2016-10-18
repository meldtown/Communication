import AbstractMessageForm from './AbstractMessageForm'
import MessageFactory from '../MessageFactory'
import $ from 'jquery'
import * as types from '../../constants'
import * as actions from '../../constants'

export default class DeclineMessageForm extends AbstractMessageForm {
	save() {
		if (!this.conversationId()) {
			throw new Error('conversationId is required')
		}

		return $.post(`${api}/messages`, {
			type: types.DECLINE_MESSAGE,
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
