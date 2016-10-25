import AbstractTemplateForm from './AbstractTemplateForm'
import axios from 'axios'


export default class DeclineTemplateForm extends AbstractTemplateForm {
	save() {
		return axios.put(`${api}/templates/${this.id()}`,
			{
				id: this.id(),
				type: 'decline',
				text: this.text(),
				title: this.title(),
				language: this.language()
			})
	}
}

