import * as generator from '../../db'
import * as ko from 'knockout'
import assert from 'assert'
import Conversation from './Conversation'

describe('Conversation', () => {
	let model
	let dispatcher

	beforeEach(() => {
		dispatcher = new ko.subscribable()
		model = new Conversation(dispatcher)
	})

	it('should be instantiable', () => {
		assert.equal(model instanceof Conversation, true)
	})

	it('should have id prop', () => {
		model.id(1)
		assert.equal(ko.isObservable(model.id), true)
		assert.equal(model.id(), 1)
	})

	it('should have lastMessage prop', () => {
		assert.equal(ko.isObservable(model.lastMessage), true)
	})

	it('should take constructor params', () => {
		let data = {id: 1, lastMessage: generator.generateStandardMessage(1, 1)}
		let model = new Conversation(dispatcher, data)
		var actual = ko.toJS(model);
		assert.equal(actual.id, data.id)
		assert.deepEqual(actual.vacancy, data.vacancy)
	})

	it('should throw an error if dispatcher not given', () => {
		// noinspection JSCheckFunctionSignatures
		assert.throws(() => new Conversation(), Error)
	})

	it('should have dispatcher prop', () => {
		assert.equal(ko.isSubscribable(model.dispatcher), true)
	})

	it('should have isSelected prop', () => {
		assert.equal(ko.isObservable(model.isSelected), true)
	})
})
