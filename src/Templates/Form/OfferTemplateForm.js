import AbstractTemplateForm from './AbstractTemplateForm'
import axios from 'axios'


export default class OfferTemplateForm extends AbstractTemplateForm {
	constructor(dispatcher, data) {
		super(dispatcher, data)
	}

	save(isNewTemplateBeingCreated) {
		let data = {
			type: 'offer',
			text: this.text(),
			title: this.title(),
			language: this.language(),
		}
		if (isNewTemplateBeingCreated) {
			return axios.post(`${api}/templates/`, data)
		}
		else {
			return axios.put(`${api}/templates/${this.id()}`, Object.assign({}, data, {id: this.id()}))
		}
	}
}

