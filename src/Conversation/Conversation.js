import * as ko from 'knockout'

export default class Conversation {
	constructor({id, lastMessage} = {}) {
		this.id = ko.observable(id)
		this.lastMessage = ko.observable(lastMessage)
	}
}
