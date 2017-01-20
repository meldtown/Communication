import * as ko from 'knockout'
import AbstractMessage from './AbstractMessage'

export default class StandardMessage extends AbstractMessage {
	constructor(data = {}) {
		super(data)
		let {avatar, multiUserId} = data
		this.avatar = ko.observable(avatar)
		this.multiUserId = ko.observable(multiUserId)
		this.template('StandardMessage')
		this.isJobsearcher = ko.computed(() => this.multiUserId() === 0)
	}
}
