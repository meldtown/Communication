import assert from 'assert'
import * as ko from 'knockout'
import $ from 'jquery'
import './hasFocus'

describe('hasFocus', () => {
	it('can work with jquery', () => {
		document.body.innerHTML = `<div>Hello World</div>`
		assert($('div').html(), 'Hello World')
	})

	it('should track hasFocus observable', () => {
		function Model() {
			this.hasFocus = ko.observable(false)
		}

		let model = new Model()

		document.body.innerHTML = `<div id="hasFocus"><input data-bind="hasFocus: hasFocus"></div>`
		ko.applyBindings(model, document.querySelector('#hasFocus'))

		document.querySelector('#hasFocus input').focus()
		assert.equal(model.hasFocus(), true)
	})
})

