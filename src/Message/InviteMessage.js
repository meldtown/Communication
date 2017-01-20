import AbstractMessage from './AbstractMessage'
import * as ko from 'knockout'
import Address from '../Address/Address'
import * as helpers from '../helpers'

export default class InviteMessage extends AbstractMessage {
	constructor(data = {}) {
		super(data)
		let {inviteDate, addressId, address, vacancy} = data
		this.inviteDate = ko.observable(inviteDate)
		this.addressId = ko.observable(addressId)

		this.vacancy = ko.observable(vacancy)
		this.address = ko.observable(new Address(address))

		this.template('InviteMessage')

		this.formattedInviteDate = ko.computed(() => helpers.formattedDate(this.inviteDate()))
		this.formattedInviteTime = ko.computed(() => helpers.formattedTime(this.inviteDate()))
	}
}
