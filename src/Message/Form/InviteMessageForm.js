import axios from 'axios'
import * as ko from 'knockout'
import * as constants from '../../constants'
import AbstractMessageForm from './AbstractMessageForm'
import MessageFactory from '../MessageFactory'
import Address from '../../Address/Address'
import * as helpers from '../../helpers'
import AddressForm from '../../Address/AddressForm'
import Attach from '../../Attach/Attach'
import OfferMessage from '../OfferMessage'
import InviteMessage from '../InviteMessage'

export default class InviteMessageForm extends AbstractMessageForm {
	constructor(dispatcher) {
		super(dispatcher)
		this.template('InviteMessageForm')
		this.addressId = ko.observable()
		this.addresses = ko.observableArray([])
		this.addressForm = ko.observable(null)

		this.selectedAddress = ko.computed(
			{
				read: () => {
					return this.addresses().filter(address => address.id() === this.addressId())[0]
				},
				write: (id) => {
					this.addressId(id)
				}
			}
		)
		this.isAddressBeingSelected = ko.observable(false)
		//
		// this.selectedAddressOptionText = ko.computed(() => {
		// 	console.log(this.selectedAddress())
		// 	return this.selectedAddress() ? this.selectedAddress().optionText(0) : 'No address'
		// })

		this.vacancyId = ko.observable()
		this.vacancies = ko.observableArray([])
		this.messages = ko.observableArray([])

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
		this.canBeSaved = ko.computed(() => this.chatId() && this.text())
		this.isAddButtonDisabled = ko.computed(() => {
			if (!this.addressForm()) return
			return !this.addressForm().city() || !this.addressForm().street() || !this.addressForm().building()
		})

		this.messages.subscribe(messages => {
			let messagesWithVacancy = messages.filter(message => message instanceof OfferMessage || message instanceof InviteMessage)

			if (messagesWithVacancy.length > 0) {
				this.vacancyId(messagesWithVacancy.pop().vacancy().id)
			} else {
				this.vacancyId('')
			}

		})

		this.isPopupVisible = ko.observable(false)
		this.showPopup = () => {
			this.isPopupVisible(true)
			this.toggleAddressDropdown()
		}
		this.hidePopup = () => this.isPopupVisible(false)

		this.lat = ko.computed(() => this.selectedAddress() ? this.selectedAddress().latitude() : 0)
		this.lng = ko.computed(() => this.selectedAddress() ? this.selectedAddress().longitude() : 0)

		this.isManaged = ko.observable(false)
		this.managedAddresses = ko.computed(() => this.addresses().slice(1))
		this.managedAddress = ko.observable()
		this.latManaged = ko.computed(() => this.managedAddress() ? this.managedAddress().latitude() : 0)
		this.lngManaged = ko.computed(() => this.managedAddress() ? this.managedAddress().longitude() : 0)

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

		return axios.post(`${api2}/messages/hubmessage`, {
			typeId: constants.INVITE_MESSAGE,
			chatId: this.chatId(),
			attachId: this.attach().id,
			headId: this.headId(),
			text: this.text(),
			inviteDate: this.inviteDate(),
			addressId: this.addressId(),
			address: ko.toJS(this.selectedAddress()),
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
		this.isPopupVisible(true)
		this.dispatcher.notifySubscribers({id: -1}, constants.ADDRESS_IS_VIEWED)
	}

	saveAddress() {
		return this.addressForm().save().then(() => {
			this.addresses.push(new Address(this.dispatcher, ko.toJS(this.addressForm())))
			this.addressId(this.addressForm().id)
			this.addressForm(null)
		})
	}

	cancelAddressForm() {
		this.addressForm(null)
	}

	toggleAddressDropdown() {
		this.isAddressBeingSelected(!this.isAddressBeingSelected())
	}

	selectAddress(address) {
		this.selectedAddress(address.id())
		this.toggleAddressDropdown()
	}

	viewAddress(address) {
		this.managedAddress(address)
		this.dispatcher.notifySubscribers({id: address.id()}, constants.ADDRESS_IS_VIEWED)
	}

	manageAddress = () => {
		this.isAddressBeingSelected(false)

		let firstManagedAddress = this.managedAddresses()[0]

		this.managedAddress(firstManagedAddress)
		this.dispatcher.notifySubscribers({id: firstManagedAddress.id()}, constants.ADDRESS_IS_VIEWED)
		this.isPopupVisible(true)
		this.isManaged(true)
	}

	unManageAddress = () => {
		this.isPopupVisible(false)
		this.isManaged(false)
	}

	fetchAddresses() {
		return axios.get(`${api2}/employer/address`)
			.then(response => {
				this.addresses([new Address(null, {id: 0})].concat(response.data.map(item => new Address(this.dispatcher, item))))
			})
	}
}
