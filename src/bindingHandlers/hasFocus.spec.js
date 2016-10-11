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
		function Dummy() {
			this.hasFocus = ko.observable(false)
		}

		var dummy = new Dummy()

		document.body.innerHTML = `<input data-bind="hasFocus: hasFocus">`
		ko.applyBindings(dummy)

		document.querySelector('input').focus()
		assert.equal(dummy.hasFocus(), true)
	})
})

