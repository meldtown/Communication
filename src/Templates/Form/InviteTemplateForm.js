import * as ko from 'knockout'
import AbstractTemplateForm from './AbstractTemplateForm'

export default class InviteTemplateForm extends AbstractTemplateForm {
	constructor() {
		super()
		this.inviteDate = ko.observable()
		this.address = ko.observable()
	}
}

