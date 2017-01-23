import axios from 'axios'
import * as ko from 'knockout'
import * as constants from '../../constants'
import AbstractMessageForm from './AbstractMessageForm'
import MessageFactory from '../MessageFactory'
import Address from '../../Address/Address'
import * as helpers from '../../helpers'
import AddressForm from '../../Address/AddressForm'
import Attach from '../../Attach/Attach'

export default class InviteMessageForm extends AbstractMessageForm {
	constructor(dispatcher) {
		super(dispatcher)
		this.template('InviteMessageForm')
		this.addressId = ko.observable()
		this.addresses = ko.observableArray([])
		this.addressForm = ko.observable(null)

		this.vacancyId = ko.observable()
		this.vacancies = ko.observableArray([])

		this.inviteDateDate = ko.observable()
		this.inviteDateTime = ko.observable()
		this.inviteDate = ko.computed({
			read: () => this.inviteDateDate() && this.inviteDateTime() ? helpers.isoDateTime(`${this.inviteDateDate()}T${this.inviteDateTime()}`) : null,
			write: date => {
				this.inviteDateDate(helpers.inputFormattedDate(date))
				this.inviteDateTime(helpers.formattedTime(date))
			}
		})


		this.hasVacancies = ko.computed(() => (this.vacancies() || []).length > 0)
		this.hasAddresses = ko.computed(() => (this.addresses() || []).length > 0)
		this.canBeSaved = ko.computed(() => this.chatId() && this.addressId() && this.text())
		this.isAddButtonDisabled = ko.computed(() => {
			if (!this.addressForm()) return
			return !this.addressForm().city() || !this.addressForm().street() || !this.addressForm().building()
		})
	}

	save() {
		if (!this.headId()) {
			throw new Error('chatId is required')
		}

		return axios.post(`${api2}/messages/hubmessage`, {
			typeId: constants.INVITE_MESSAGE,
			chatId: this.chatId(),
			attachId: this.attach().id,
			headId: this.headId(),
			text: this.text(),
			inviteDate: this.inviteDate(),
			addressId: this.addressId(),
			vacancy: {id: this.vacancyId()},
			attach: this.attach()
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
		this.inviteDate('')
		this.addressId(0)
		this.vacancyId(0)
	}

	createAddress() {
		this.addressForm(new AddressForm())
	}

	saveAddress() {
		return this.addressForm().save().then(() => {
			this.addressId(this.addressForm().id)
			this.addresses.push(new Address(ko.toJS(this.addressForm())))
			this.addressForm(null)
		})
	}

	cancelAddressForm() {
		this.addressForm(null)
	}

	fetchAddresses() {
		return axios.get(`${api2}/employer/address`)
			.then(response => this.addresses(response.data.map(item => new Address(item))))
	}
}
