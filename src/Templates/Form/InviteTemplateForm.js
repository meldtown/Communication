import * as ko from 'knockout'
import AbstractTemplateForm from './AbstractTemplateForm'
import axios from 'axios'


export default class InviteTemplateForm extends AbstractTemplateForm {
	constructor(dispatcher, data) {
		super(dispatcher, data)
		this.inviteDate = ko.observable()
		this.addressId = ko.observable()
		this.template = ko.observable('InviteTemplateForm')
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
}

