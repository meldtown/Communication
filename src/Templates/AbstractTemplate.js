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


// constructor(dispatcher, data, parent) {

//
// 	this.title = ko.observable()
// 	this.text = ko.observable()
// 	this.language = ko.observable('ru')
// 	this.isSelected = ko.observable(false)
// 	this.type = type
// 	this.id = null
// 	this.dispatcher = dispatcher
// 	this.parent = parent
//
// 	if (data) {
// 		this.fromJs(data)
// 	}
//

// }

