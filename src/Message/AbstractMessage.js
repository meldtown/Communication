import * as ko from 'knockout'


export default class AbstractMessage {
	constructor({id, date, conversationId, text, isRead} = {}) {
		this.id = ko.observable(id)
		this.date = ko.observable(date)
		this.conversationId = ko.observable(conversationId)
		this.text = ko.observable(text)
		this.isRead = ko.observable(isRead)
	}
}
