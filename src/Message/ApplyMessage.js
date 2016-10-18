import AbstractMessage from './AbstractMessage'
import * as ko from 'knockout'
export default class ApplyMessage extends AbstractMessage {
	constructor(data = {}) {
		super(data)
		let {avatar} = data
		this.avatar = ko.observable(avatar)
		this.template('ApplyMessage')
	}
}
