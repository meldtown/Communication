import * as ko from 'knockout'

export default class AbstractMessageForm {
	constructor(dispatcher) {
		if (!ko.isSubscribable(dispatcher)) {
			throw new Error('ko.subscribable is required')
		}

		this.dispatcher = dispatcher
		this.text = ko.observable()
	}
}
