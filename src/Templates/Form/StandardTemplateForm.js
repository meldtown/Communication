import AbstractTemplateForm from './AbstractTemplateForm'
import axios from 'axios'
import * as ko from 'knockout'
import * as constants from '../../constants'
import Attach from '../../Attach/Attach'

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

	resetAttach() {
		let put = (function () {
			this.attach(new Attach())
			let data = {
				type: constants.STANDARD_MESSAGE,
				text: this.text(),
				name: this.name(),
				language: this.language(),
				attach: this.attach(),
				attachId: this.attach().id
			}
			return axios.put(`${api2}/templates/${this.id()}`, Object.assign({}, data, {id: this.id()}))
		}).bind(this)
		axios.delete(`${api2}/attaches/${this.attach().id}`).then(put, put)
	}
}
