import AbstractMessage from './AbstractMessage'
import * as ko from 'knockout'
export default class InviteMessage extends AbstractMessage {
	constructor(data = {}) {
		super(data)
		let {inviteDate, address} = data
		this.inviteDate = ko.observable(inviteDate)
		this.address = ko.observable(address)
	}
}
