import * as ko from 'knockout'

export default class MessageList {
	constructor() {
		this.messages = ko.observableArray()
	}
}
