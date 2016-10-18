import * as ko from 'knockout'
import assert from 'assert'
import AbstractMessageForm from './AbstractMessageForm'

describe('AbstractMessageForm', () => {
	let model
	let dispatcher

	beforeEach(() => {
		dispatcher = new ko.subscribable()
		model = new AbstractMessageForm(dispatcher)
	})

	it('should be instantiable', () => {
		assert.equal(model instanceof AbstractMessageForm, true)
	})

	it('should throw an error if dispatcher not given', () => {
		// noinspection JSCheckFunctionSignatures
		assert.throws(() => new AbstractMessageForm(), Error)
	})

	it('should have dispatcher prop', () => {
		assert.equal(ko.isSubscribable(model.dispatcher), true)
	})

	it('should have text prop', () => {
		model.text('text')
		assert.equal(ko.isObservable(model.text), true)
		assert.equal(model.text(), 'text')
	})
})
