import AbstractTemplateView from './AbstractTemplateView'
import * as ko from 'knockout'

export default class InviteTemplateView extends AbstractTemplateView {
	constructor(data = {}) {
		super(data)
		let {inviteDate, address} = data
		this.inviteDate = ko.observable(inviteDate)
		this.address = ko.observable(address)
	}
}

