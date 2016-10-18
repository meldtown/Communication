import * as ko from 'knockout'
import AbstractMessageForm from './AbstractMessageForm'

export default class InviteMessageForm extends AbstractMessageForm {
	constructor(dispatcher) {
		super(dispatcher)
		this.inviteDate = ko.observable()
		this.address = ko.observable()
	}
}
