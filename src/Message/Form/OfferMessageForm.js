import * as ko from 'knockout'
import $ from 'jquery'
import * as types from '../types'
import * as actions from '../../actions'
import AbstractMessageForm from './AbstractMessageForm'
import MessageFactory from '../MessageFactory'

export default class OfferMessageForm extends AbstractMessageForm {
	constructor(dispatcher) {
		super(dispatcher)

		this.vacancyId = ko.observable()
	}

	save() {
		if (!this.conversationId()) {
			throw new Error('conversationId is required')
		}

		return $.post(`${api}/messages`, {
			type: types.OFFER,
			conversationId: this.conversationId(),
			text: this.text(),
			vacancyId: this.vacancyId()
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
		this.vacancyId(0)
	}
}
