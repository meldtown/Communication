import AbstractTemplateForm from './AbstractTemplateForm'
import axios from 'axios'
import * as ko from 'knockout'


export default class DeclineTemplateForm extends AbstractTemplateForm {
	constructor(dispatcher, data) {
		super(dispatcher, data)
		this.template = ko.observable('DeclineTemplateForm')
	}

	save() {
		let data = {
			type: 'decline',
			text: this.text(),
			title: this.title(),
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

