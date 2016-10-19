import * as ko from 'knockout'
import assert from 'assert'
import Accordion from './Accordion'

describe('Accordion', () => {
	let model
	let dispatcher

	beforeEach(() => {
		dispatcher = new ko.subscribable()
		model = new Accordion(dispatcher)
	})

	it('should be instantiable', () => {
		assert.equal(model instanceof Accordion, true)
	})

	it('should throw an error if dispatcher not given', () => {
		// noinspection JSCheckFunctionSignatures
		assert.throws(() => new Accordion(), Error)
	})

	it('should have dispatcher prop', () => {
		assert.equal(ko.isSubscribable(model.dispatcher), true)
	})
})
