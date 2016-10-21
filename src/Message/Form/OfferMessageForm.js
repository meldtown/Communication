import * as ko from 'knockout'
import axios from 'axios'
import * as constants from '../../constants'
import AbstractMessageForm from './AbstractMessageForm'
import MessageFactory from '../MessageFactory'

export default class OfferMessageForm extends AbstractMessageForm {
	constructor(dispatcher) {
		super(dispatcher)
		this.template('OfferMessageForm')
		this.vacancyId = ko.observable()
	}

	save() {
		if (!this.conversationId()) {
			throw new Error('conversationId is required')
		}

		return axios.post(`${api}/messages`, {
			type: constants.OFFER_MESSAGE,
			conversationId: this.conversationId(),
			text: this.text(),
			vacancyId: this.vacancyId()
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
		this.vacancyId(0)
	}
}
