import * as ko from 'knockout'
import AbstractMessageForm from './AbstractMessageForm'

export default class InviteMessageForm extends AbstractMessageForm {
	constructor() {
		super()
		this.time = ko.observable()
		this.address = ko.observable()
	}
}
