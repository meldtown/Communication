import AbstractTemplateView from './AbstractTemplateView'
import * as ko from 'knockout'

export default class InviteTemplateView extends AbstractTemplateView {
	constructor(dispatcher, data = {}) {
		super(dispatcher, data)
		let {inviteDate, addressId} = data
		this.inviteDate = ko.observable(inviteDate)
		this.addressId = ko.observable(addressId)
		this.template = ko.observable('InviteTemplateForm')
	}
}

