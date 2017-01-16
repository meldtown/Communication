import * as ko from 'knockout'

export default class AbstractTemplate {
	constructor(dispatcher, {id, name, text, language} = {}) {
		if (!ko.isSubscribable(dispatcher)) {
			throw new Error('ko.subscribable is required')
		}

		this.id = ko.observable(id)
		this.language = ko.observable(language)
		this.text = ko.observable(text)
		this.name = ko.observable(name)
		this.dispatcher = dispatcher
	}
}
