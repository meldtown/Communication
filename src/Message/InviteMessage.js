import AbstractMessage from './AbstractMessage'
import * as ko from 'knockout'
export default class InviteMessage extends AbstractMessage {
	constructor(data = {}) {
		super(data)
		let {inviteDate, addressId} = data
		this.inviteDate = ko.observable(inviteDate)
		this.addressId = ko.observable(addressId)
		this.template('InviteMessage')
	}
}
