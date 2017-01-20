import AbstractMessage from './AbstractMessage'
import * as ko from 'knockout'
export default class ApplyMessage extends AbstractMessage {
	constructor(data = {}) {
		super(data)
		let {vacancy, resume} = data
		this.vacancy = ko.observable(vacancy)
		this.resume = ko.observable(resume)
		this.template('ApplyMessage')
	}
}
