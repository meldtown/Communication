import AbstractMessage from './AbstractMessage'
import * as ko from 'knockout'
import Address from '../Address/Address'
import * as helpers from '../helpers'

export default class InviteMessage extends AbstractMessage {
	constructor(data = {}) {
		super(data)
		let {inviteDate, addressId, address} = data
		this.inviteDate = ko.observable(inviteDate)
		this.addressId = ko.observable(addressId)
		this.address = ko.observable(new Address(address))
		this.template('InviteMessage')

		this.formattedDate = ko.computed(() => helpers.formattedDate(this.date()))
		this.formattedTime = ko.computed(() => helpers.formattedTime(this.date()))
	}
}
