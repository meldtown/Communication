import AbstractTemplateForm from './AbstractTemplateForm'
import axios from 'axios'
import * as ko from 'knockout'
import * as constants from '../../constants'

export default class StandardTemplateForm extends AbstractTemplateForm {
	constructor(dispatcher, data = {}) {
		super(dispatcher, data)
		this.template = ko.observable('StandardTemplateForm')
	}

	save() {
		let data = {
			type: constants.STANDARD_MESSAGE,
			text: this.text(),
			name: this.name(),
			language: this.language(),
		}
		if (this.id()) {
			return axios.put(`${api}/templates/${this.id()}`, Object.assign({}, data, {id: this.id()}))
		}
		else {
			return axios.post(`${api}/templates/`, data)
		}
	}
}
