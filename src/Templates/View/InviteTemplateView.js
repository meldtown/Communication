import AbstractTemplateView from './AbstractTemplateView'
import * as ko from 'knockout'

export default class InviteTemplateView extends AbstractTemplateView {
	constructor(data = {}) {
		super(data)
		let {inviteDate, addressId} = data
		this.inviteDate = ko.observable(inviteDate)
		this.addressId = ko.observable(addressId)
	}
}

