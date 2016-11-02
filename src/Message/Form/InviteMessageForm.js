import axios from 'axios'
import * as ko from 'knockout'
import * as constants from '../../constants'
import AbstractMessageForm from './AbstractMessageForm'
import MessageFactory from '../MessageFactory'
import Address from '../../Address/Address'
import * as helpers from '../../helpers'
import AddressForm from '../../Address/AddressForm'


export default class InviteMessageForm extends AbstractMessageForm {
	constructor(dispatcher) {
		super(dispatcher)
		this.template('InviteMessageForm')
		this.addressId = ko.observable()
		this.addresses = ko.observableArray([])
		this.addressForm = ko.observable(null)

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
		this.isAddButtonDisabled = ko.computed(() => {
			if (!this.addressForm()) return
			return !this.addressForm().city() || !this.addressForm().street() || !this.addressForm().houseNumber()
		})
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

	createAddress() {
		this.addressForm(new AddressForm())
	}

	addAddress() {
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
		return axios.get(`${api}/addresses`)
			.then(response => this.addresses(response.data.map(item => new Address(item))))
	}
}
