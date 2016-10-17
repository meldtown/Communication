import * as ko from 'knockout'
import AbstractTemplateForm from './AbstractTemplateForm'

export default class InviteTemplateForm extends AbstractTemplateForm {
	constructor() {
		super()
		this.time = ko.observable()
		this.address = ko.observable()
	}
}

