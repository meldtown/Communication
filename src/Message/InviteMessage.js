import AbstractMessage from './AbstractMessage'
import * as ko from 'knockout'
export default class InviteMessage extends AbstractMessage {
	constructor(data = {}) {
		super(data)
		let {time, address} = data
		this.time = ko.observable(time)
		this.address = ko.observable(address)
	}
}
