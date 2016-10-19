import * as ko from 'knockout'
import AbstractMessage from './AbstractMessage'

export default class StandardMessage extends AbstractMessage {
	constructor(data = {}) {
		super(data)
		let {avatar, multiUser} = data
		this.avatar = ko.observable(avatar)
		this.multiUser = ko.observable(multiUser)
		this.template('StandardMessage')
		this.isJobsearcher = ko.computed(() => this.multiUser() === 0)
	}
}
