import * as ko from 'knockout'
import AbstractMessage from './AbstractMessage'

export default class StandardMessage extends AbstractMessage {
	constructor(data = {}) {
		super(data)
		let {multiUserId} = data
		this.multiUserId = ko.observable(multiUserId)
		this.template('StandardMessage')
		this.isJobsearcher = ko.computed(() => this.multiUserId() === 0)
	}
}
