import AbstractTemplateForm from './AbstractTemplateForm'
import axios from 'axios'


export default class OfferTemplateForm extends AbstractTemplateForm {
	constructor(dispatcher) {
		super(dispatcher)
	}

	save() {
		return axios.put(`${api}/templates/${this.id()}`,
			{
				id: this.id(),
				type: 'offer',
				text: this.text(),
				title: this.title(),
				language: this.language()
			})
	}
}

