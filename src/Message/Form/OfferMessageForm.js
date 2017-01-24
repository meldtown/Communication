import * as ko from 'knockout'
import axios from 'axios'
import * as constants from '../../constants'
import AbstractMessageForm from './AbstractMessageForm'
import MessageFactory from '../MessageFactory'
import Attach from '../../Attach/Attach'
import OfferMessage from '../OfferMessage'
import InviteMessage from '../InviteMessage'

export default class OfferMessageForm extends AbstractMessageForm {
	constructor(dispatcher) {
		super(dispatcher)
		this.template('OfferMessageForm')
		this.vacancyId = ko.observable()
		this.vacancies = ko.observableArray([])
		this.messages = ko.observableArray([])

		this.hasVacancies = ko.computed(() => (this.vacancies() || []).length > 0)
		this.canBeSaved = ko.computed(() => this.chatId() && this.vacancyId() && this.text())

		this.messages.subscribe(messages => {
			let messagesWithVacancy = messages.filter(message => message instanceof OfferMessage || message instanceof InviteMessage)

			if (messagesWithVacancy.length > 0) {
				this.vacancyId(messagesWithVacancy.pop().vacancy().id)
			} else {
				this.vacancyId(0)
			}
		})

		dispatcher.subscribe(message => {
			if (message.headId() === this.headId()) {
				this.messages.push(message)
			}
		}, this, constants.NEW_MESSAGE)
	}

	save() {
		if (!this.headId()) {
			throw new Error('headId is required')
		}

		if (!this.vacancyId()) {
			throw new Error('vacancyId is required')
		}

		return axios.post(`${api2}/messages/hubmessage`, {
			typeId: constants.OFFER_MESSAGE,
			chatId: this.chatId(),
			attachId: this.attach().id,
			headId: this.headId(),
			text: this.text(),
			attach: this.attach(),
			vacancy: {id: this.vacancyId()}
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
		this.vacancyId(0)
	}
}
