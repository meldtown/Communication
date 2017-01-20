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
		this.vacancies = ko.observableArray([])

		this.hasVacancies = ko.computed(() => (this.vacancies() || []).length > 0)
		this.canBeSaved = ko.computed(() => this.chatId() && this.vacancyId() && this.text())
	}

	save() {
		if (!this.chatId()) {
			throw new Error('chatId is required')
		}

		if (!this.vacancyId()) {
			throw new Error('vacancyId is required')
		}

		return axios.post(`${api2}/messages/hubmessage`, {
			typeId: constants.OFFER_MESSAGE,
			chatId: this.chatId(),
			headId: this.headId(),
			text: this.text(),
			// vacancyId: this.vacancyId()
			vacancy: {id: this.vacancyId()}
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

	fetchVacancies() {
		return axios.get(`${api2}/employer/vacancylist`)
			.then(response => this.vacancies(response.data))
	}
}
