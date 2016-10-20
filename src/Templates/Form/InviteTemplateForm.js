import * as ko from 'knockout'
import AbstractTemplateForm from './AbstractTemplateForm'

export default class InviteTemplateForm extends AbstractTemplateForm {
	constructor(dispatcher) {
		super(dispatcher)
		this.inviteDate = ko.observable()
		this.addressId = ko.observable()
	}
}

