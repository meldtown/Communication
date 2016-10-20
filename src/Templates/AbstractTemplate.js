import * as ko from 'knockout'
import * as actions from '../constants'

export default class AbstractTemplate {
	constructor(dispatcher, {id, title, text, language} = {}) {
		if (!ko.isSubscribable(dispatcher)) {
			throw new Error('ko.subscribable is required')
		}
		this.id = ko.observable(id)
		this.language = ko.observable(language)
		this.text = ko.observable(text)
		this.title = ko.observable(title)
		this.isSelected = ko.observable(false)
		this.dispatcher = dispatcher

		dispatcher.subscribe(template => {
			console.log(`sub this ${this.id()} === ${template.id()}`)
			if (this.constructor === template.constructor) {
				this.isSelected(this.id() === template.id())
			}
		}, this, actions.TEMPLATE_SELECTED)
	}

	select() {
		this.dispatcher.notifySubscribers(this, actions.TEMPLATE_SELECTED)
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

