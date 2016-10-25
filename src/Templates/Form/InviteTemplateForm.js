import * as ko from 'knockout'
import AbstractTemplateForm from './AbstractTemplateForm'
import axios from 'axios'


export default class InviteTemplateForm extends AbstractTemplateForm {
	constructor(dispatcher, data) {
		super(dispatcher, data)
		this.inviteDate = ko.observable()
		this.addressId = ko.observable()
	}

	save(isNewTemplateBeingCreated) {
		let data = {
			type: 'invite',
			text: this.text(),
			title: this.title(),
			language: this.language(),
			inviteDate: this.inviteDate(),
			addressId: this.addressId()
		}
		if (isNewTemplateBeingCreated) {
			return axios.post(`${api}/templates/`, data)
		}
		else {
			return axios.put(`${api}/templates/${this.id()}`, Object.assign({}, data, {id: this.id()}))
		}
	}

	fill(selectedTemplate) {
		super.fill(selectedTemplate)
		selectedTemplate.addressId(this.addressId())
		selectedTemplate.inviteDate(this.inviteDate())
	}
}

