import * as ko from 'knockout'
import assert from 'assert'
import StandardMessageForm from './StandardMessageForm'
import AbstractMessageForm from './AbstractMessageForm'

describe('StandardMessageForm', () => {
	let model
	let dispatcher

	beforeEach(() => {
		dispatcher = new ko.subscribable()
		model = new StandardMessageForm(dispatcher)
	})

	it('should be instantiable', () => {
		assert.equal(model instanceof StandardMessageForm, true)
		assert.equal(model instanceof AbstractMessageForm, true)
	})

	it('should have save method', () => {
		assert.equal(typeof model.save, 'function')
	})

	it('should not try save message without conversationId', () => {
		assert.throws(() => model.save(), Error)
	})
})
