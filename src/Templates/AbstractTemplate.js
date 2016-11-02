import * as ko from 'knockout'

export default class AbstractTemplate {
	constructor(dispatcher, {id, title, text, language} = {}) {
		if (!ko.isSubscribable(dispatcher)) {
			throw new Error('ko.subscribable is required')
		}

		this.id = ko.observable(id)
		this.language = ko.observable(language)
		this.text = ko.observable(text)
		this.title = ko.observable(title)
		this.dispatcher = dispatcher
	}
}
