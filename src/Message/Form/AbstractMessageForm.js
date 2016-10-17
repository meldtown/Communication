import * as ko from 'knockout'

export default class AbstractMessageForm {
	constructor() {
		this.text = ko.observable()
	}
}
