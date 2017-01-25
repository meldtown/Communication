import * as ko from 'knockout'
import AbstractMessage from './AbstractMessage'

export default class DeclineMessage extends AbstractMessage {
	constructor(data = {}) {
		super(data)
		let {vacancy} = data
		this.vacancy = ko.observable(vacancy)
		this.template('DeclineMessage')
	}
}
