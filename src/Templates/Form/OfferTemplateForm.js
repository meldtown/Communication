import AbstractTemplateForm from './AbstractTemplateForm'
import axios from 'axios'
import * as ko from 'knockout'
import * as constants from '../../constants'

export default class OfferTemplateForm extends AbstractTemplateForm {
	constructor(dispatcher, data) {
		super(dispatcher, data)
		this.template = ko.observable('OfferTemplateForm')
	}

	save() {
		let data = {
			type: constants.OFFER_MESSAGE,
			text: this.text(),
			name: this.name(),
			language: this.language(),
			attach: this.attach(),
			attachId: this.attach().id
		}
		if (this.id()) {
			return axios.put(`${api2}/templates/${this.id()}`, Object.assign({}, data, {id: this.id()}))
		}
		else {
			return axios.post(`${api2}/templates/`, data)
		}
	}
}

