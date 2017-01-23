import * as ko from 'knockout'
import AbstractTemplateForm from './AbstractTemplateForm'
import axios from 'axios'
import * as constants from '../../constants'
// import AddressForm from '../../Address/AddressForm'
// import Address from '../../Address/Address'


export default class InviteTemplateForm extends AbstractTemplateForm {
	constructor(dispatcher, data = {}) {
		super(dispatcher, data)
		let {inviteDate} = data
		this.inviteDate = ko.observable(inviteDate)
		// this.addressId = ko.observable(addressId)
		this.template = ko.observable('InviteTemplateForm')
		// this.addressForm = ko.observable(null)
		// this.addresses = ko.observableArray([])
		// this.isAddButtonDisabled = ko.computed(() => {
		// 	if (!this.addressForm()) return
		// 	return !this.addressForm().city() || !this.addressForm().street() || !this.addressForm().building()
		// })
	}

	save() {
		let data = {
			type: constants.INVITE_MESSAGE,
			text: this.text(),
			name: this.name(),
			language: this.language(),
			inviteDate: this.inviteDate(),
			attach: this.attach(),
			attachId: this.attach().id
			// addressId: this.addressId()
		}
		if (this.id()) {
			return axios.put(`${api2}/templates/${this.id()}`, {...data, id: this.id()})
		}
		else {
			return axios.post(`${api2}/templates/`, data)
		}
	}

	fill(selectedTemplate) {
		// selectedTemplate.addressId(this.addressId())
		selectedTemplate.inviteDate(this.inviteDate())
		// let address = this.addresses().filter(address => {
		// 	return address.id() === this.addressId()
		// }).shift()
		// selectedTemplate.address(address)
		super.fill(selectedTemplate)
	}

	// createAddress() {
	// 	this.addressForm(new AddressForm())
	// }
    //
	// saveAddress() {
	// 	return this.addressForm().save().then(() => {
	// 		this.addressId(this.addressForm().id)
	// 		this.addresses.push(new Address(ko.toJS(this.addressForm())))
	// 		this.addressForm(null)
	// 	})
	// }

	// cancelAddressForm() {
	// 	this.addressForm(null)
	// }

	// fetchAddresses() {
	// 	return axios.get(`${api}/addresses`)
	// 		.then(response => this.addresses(response.data.map(item => new Address(item))))
	// }
}

