import assert from 'assert'
import * as ko from 'knockout'
import $ from 'jquery'
import hasFocus from './hasFocus'

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

	it('should set focus and blur handlers', () => {
		let observable = ko.observable(false)
		let accessor = () => observable
		let input = document.createElement('INPUT')
		hasFocus.init(input, accessor)
		assert.equal(observable(), false)
		input.focus()
		assert.equal(observable(), true)
		input.blur()
		assert.equal(observable(), false)
	})

	it('should call focus or blur on update', () => {
		let observable = ko.observable(false)
		let accessor = () => observable
		let input = document.createElement('INPUT')
		let focusCounter = 0
		let blurCounter = 0
		input.focus = () => focusCounter += 1
		input.blur = () => blurCounter += 1

		hasFocus.update(input, accessor)
		assert.equal(blurCounter, 1)

		observable(true)
		hasFocus.update(input, accessor)
		assert.equal(focusCounter, 1)
		assert.equal(blurCounter, 1)

	})
})

