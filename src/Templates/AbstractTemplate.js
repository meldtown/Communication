import * as ko from 'knockout'

export default class AbstractTemplate {
	constructor({id, title, text, language} = {}) {
		this.id = ko.observable(id)
		this.language = ko.observable(language)
		this.text = ko.observable(text)
		this.title = ko.observable(title)
	}
}
