import * as ko from 'knockout'
import AbstractMessageForm from './AbstractMessageForm'
import MessageFactory from '../MessageFactory'
import axios from 'axios'
import * as constants from '../../constants'
import Attach from '../../Attach/Attach'
import ApplyMessage from '../ApplyMessage'

export default class DeclineMessageForm extends AbstractMessageForm {
	constructor(dispatcher) {
		super(dispatcher)
		this.template('DeclineMessageForm')

		this.vacancyId = ko.observable()
		this.vacancies = ko.observableArray([])
		this.messages = ko.observableArray([])

		this.messages.subscribe(messages => {
			let applyMessages = messages.filter(message => message instanceof ApplyMessage)

			if (applyMessages.length > 0) {
				let options = applyMessages.map(item => item.vacancy())
				let map = new Map()

				options.forEach(option => map.set(option.id, option))

				let array = [...map.values()].map(option => {
					option.label = option.name + ' (' + option.city.ru + ')'
					return option
				})

				this.vacancies(array)
			}
		})

		dispatcher.subscribe(message => {
			if (message.headId() === this.headId()) {
				this.messages.push(message)
			}
		}, this, constants.NEW_MESSAGE)

		this.hasVacancies = ko.computed(() => (this.vacancies() || []).length > 0)
	}

	save() {
		if (!this.headId()) {
			throw new Error('headId is required')
		}

		return axios.post(`${api2}/messages/hubmessage`, {
			typeId: constants.DECLINE_MESSAGE,
			chatId: this.chatId(),
			headId: this.headId(),
			attachId: this.attach().id,
			attach: this.attach(),
			text: this.text(),
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
