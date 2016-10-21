import AbstractMessage from './AbstractMessage'
import * as ko from 'knockout'
import Address from '../Address/Address'
import moment from 'moment'

export default class InviteMessage extends AbstractMessage {
	constructor(data = {}) {
		super(data)
		let {inviteDate, addressId, address} = data
		this.inviteDate = ko.observable(inviteDate)
		this.addressId = ko.observable(addressId)
		this.address = ko.observable(new Address(address))
		this.template('InviteMessage')

		this.formattedDate = ko.computed(() => moment(this.date()).format('LL'))
		this.formattedTime = ko.computed(() => moment(this.date()).format('HH:mm'))
	}
}
