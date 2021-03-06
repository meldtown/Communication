import AbstractTemplateView from './AbstractTemplateView'
import * as ko from 'knockout'
// import Address from '../../Address/Address'

export default class InviteTemplateView extends AbstractTemplateView {
	constructor(dispatcher, data = {}) {
		super(dispatcher, data)
		let {inviteDate} = data
		this.inviteDate = ko.observable(inviteDate)
		// this.addressId = ko.observable(addressId)
		this.template = ko.observable('InviteTemplateView')
		// this.address = ko.observable(new Address(address))
		// this.addressText = ko.computed(() => {
		// 	if (this.address()) {
		// 		return (this.address().id()) ? this.address().optionText() : 'No attached address'
		// 	} else return 'No attached address'
		// })
	}
}

