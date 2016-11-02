import * as ko from 'knockout'
import AbstractTemplateForm from './AbstractTemplateForm'
import axios from 'axios'
import * as constants from '../../constants'


export default class InviteTemplateForm extends AbstractTemplateForm {
	constructor(dispatcher, data = {}) {
		super(dispatcher, data)
		let {inviteDate, addressId} = data
		this.inviteDate = ko.observable(inviteDate)
		this.addressId = ko.observable(addressId)
		this.template = ko.observable('InviteTemplateForm')
	}

	save() {
		let data = {
			type: constants.INVITE_MESSAGE,
			text: this.text(),
			title: this.title(),
			language: this.language(),
			inviteDate: this.inviteDate(),
			addressId: this.addressId()
		}
		if (this.id()) {
			return axios.put(`${api}/templates/${this.id()}`, {...data, id: this.id()})
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
}

