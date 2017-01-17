import * as ko from 'knockout'
import * as languages from '../constants'

export default class AbstractTemplate {
	constructor(dispatcher, {id, name, text, language} = {}) {
		if (!ko.isSubscribable(dispatcher)) {
			throw new Error('ko.subscribable is required')
		}
		switch (language) {
			case 1: language = languages.RU
				break
			case 2: language = languages.UA
				break
			case 3: language = languages.EN
				break
		}

		this.id = ko.observable(id)
		this.language = ko.observable(language)
		this.text = ko.observable(text)
		this.name = ko.observable(name)
		this.dispatcher = dispatcher
	}
}
