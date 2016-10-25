import AbstractTemplateForm from './AbstractTemplateForm'
import axios from 'axios'


export default class StandardTemplateForm extends AbstractTemplateForm {
	constructor(dispatcher, data = {}) {
		super(dispatcher, data)
	}

	save() {
		return axios.put(`${api}/templates/${this.id()}`,
			{
				id: this.id(),
				type: 'standard',
				text: this.text(),
				title: this.title(),
				language: this.language()
			})
	}
}
