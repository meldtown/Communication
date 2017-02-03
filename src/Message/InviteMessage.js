import AbstractMessage from './AbstractMessage'
import * as ko from 'knockout'
import * as helpers from '../helpers'
import Addrss from '../Address/Address'

export default class InviteMessage extends AbstractMessage {
	constructor(data = {}) {
		super(data)
		let {inviteDate, addressId, address, vacancy} = data
		this.inviteDate = ko.observable(inviteDate)
		this.addressId = ko.observable(addressId)

		this.vacancy = ko.observable(vacancy)
		this.address = ko.observable(new Addrss(address))

		this.template('InviteMessage')

		this.formattedInviteDate = ko.computed(() => helpers.formattedDate(this.inviteDate()))
		this.formattedInviteTime = ko.computed(() => helpers.formattedTime(this.inviteDate()))
	}
}
