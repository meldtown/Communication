import $ from 'jquery'
import * as ko from 'knockout'
import * as actions from '../../actions'
import * as types from '../../types'
import AbstractMessageForm from './AbstractMessageForm'
import MessageFactory from '../MessageFactory'

export default class InviteMessageForm extends AbstractMessageForm {
	constructor(dispatcher) {
		super(dispatcher)
		this.inviteDate = ko.observable()
		this.addressId = ko.observable()
	}

	save() {
		if (!this.conversationId()) {
			throw new Error('conversationId is required')
		}

		return $.post(`${api}/messages`, {
			type: types.INVITE_MESSAGE,
			conversationId: this.conversationId(),
			text: this.text(),
			inviteDate: this.inviteDate(),
			addressId: this.addressId()
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
		this.inviteDate('')
		this.addressId(0)
	}
}
