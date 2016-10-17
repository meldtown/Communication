import * as ko from 'knockout'
import assert from 'assert'
import AbstractMessageForm from './AbstractMessageForm'

describe('AbstractMessageForm', () => {
	let model

	beforeEach(() => {
		model = new AbstractMessageForm()
	})

	it('should be instantiable', () => {
		assert.equal(model instanceof AbstractMessageForm, true)
	})

	it('should have text prop', () => {
		model.text('text')
		assert.equal(ko.isObservable(model.text), true)
		assert.equal(model.text(), 'text')
	})
})
