import $ from 'jquery'
import * as ko from 'knockout'
import './Hub.scss'
import '../bindingHandlers/hasFocus'

export default class Hub {
	constructor() {
		this.a = ko.observable()
		this.b = ko.observable()

		this.numericA = ko.computed(() => isNaN(parseInt(this.a())) ? 0 : parseInt(this.a()))
		this.numericB = ko.computed(() => isNaN(parseInt(this.b())) ? 0 : parseInt(this.b()))

		this.aHasFocus = ko.observable()

		this.sum = ko.computed(() => this.numericA() + this.numericB())
	}

	fetch() {
		return $.getJSON(`${api}/conversations`)
			.then(conversations => {
				this.a(conversations.length / 2)
				this.b(conversations.length / 2)
			})
			.fail(() => {
				this.a(1)
				this.b(1)
			})
	}
}
