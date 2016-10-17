import * as ko from 'knockout'

export default class AbstractMessage {
	constructor() {
		this.id = ko.observable()
		this.date = ko.observable()
		this.conversationId = ko.observable()
		this.text = ko.observable()
	}
}
