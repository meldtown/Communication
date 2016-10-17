import * as ko from 'knockout'

export default class AbstractMessage {
	constructor({id, date, conversationId, text} = {}) {
		this.id = ko.observable(id)
		this.date = ko.observable(date)
		this.conversationId = ko.observable(conversationId)
		this.text = ko.observable(text)
	}
}
