import axios from 'axios'
import * as ko from 'knockout'
import * as constants from '../../constants'
import AbstractMessageForm from './AbstractMessageForm'
import MessageFactory from '../MessageFactory'
import Address from '../../Address/Address'
import * as helpers from '../../helpers'

export default class InviteMessageForm extends AbstractMessageForm {
	constructor(dispatcher) {
		super(dispatcher)
		this.template('InviteMessageForm')
		this.addressId = ko.observable()
		this.addresses = ko.observableArray([])

		this.inviteDateDate = ko.observable()
		this.inviteDateTime = ko.observable()
		this.inviteDate = ko.computed({
			read: () => this.inviteDateDate() && this.inviteDateTime() ? helpers.isoDateTime(`${this.inviteDateDate()}T${this.inviteDateTime()}`) : null,
			write: date => {
				this.inviteDateDate(helpers.inputFormattedDate(date))
				this.inviteDateTime(helpers.formattedTime(date))
			}
		})

		this.hasAddresses = ko.computed(() => (this.addresses() || []).length > 0)
		this.canBeSaved = ko.computed(() => this.conversationId() && this.addressId() && this.text())
	}

	save() {
		if (!this.conversationId()) {
			throw new Error('conversationId is required')
		}

		return axios.post(`${api}/messages`, {
			type: constants.INVITE_MESSAGE,
			conversationId: this.conversationId(),
			text: this.text(),
			inviteDate: this.inviteDate(),
			addressId: this.addressId()
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
		this.inviteDate('')
		this.addressId(0)
	}

	fetchAddresses() {
		return axios.get(`${api}/addresses`)
			.then(response => this.addresses(response.data.map(item => new Address(item))))
	}
}
