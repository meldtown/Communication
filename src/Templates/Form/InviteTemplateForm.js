import * as ko from 'knockout'
import AbstractTemplateForm from './AbstractTemplateForm'
import axios from 'axios'
import AddressForm from '../../Address/AddressForm'
import Address from '../../Address/Address'


export default class InviteTemplateForm extends AbstractTemplateForm {
	constructor(dispatcher, data) {
		super(dispatcher, data)
		this.inviteDate = ko.observable()
		this.addressId = ko.observable()
		this.template = ko.observable('InviteTemplateForm')
		this.addressForm = ko.observable(null)
		this.addresses = ko.observableArray([])
	}

	save() {
		let data = {
			type: 'invite',
			text: this.text(),
			title: this.title(),
			language: this.language(),
			inviteDate: this.inviteDate(),
			addressId: this.addressId()
		}
		if (this.id()) {
			return axios.put(`${api}/templates/${this.id()}`, Object.assign({}, data, {id: this.id()}))
		}
		else {
			return axios.post(`${api}/templates/`, data)
		}
	}

	fill(selectedTemplate) {
		super.fill(selectedTemplate)
		selectedTemplate.addressId(this.addressId())
		selectedTemplate.inviteDate(this.inviteDate())
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
		return axios.get(`${api}/addresses`)
			.then(response => this.addresses(response.data.map(item => new Address(item))))
	}
}

