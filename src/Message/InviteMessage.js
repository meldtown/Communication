import AbstractMessage from './AbstractMessage'
import * as ko from 'knockout'
export default class InviteMessage extends AbstractMessage {
	constructor() {
		super()
		this.time = ko.observable()
		this.address = ko.observable()
	}
}
