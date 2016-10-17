import * as generator from '../../db'
import * as ko from 'knockout'
import assert from 'assert'
import Conversation from './Conversation'

describe('Conversation', () => {
	let model

	beforeEach(() => {
		model = new Conversation()
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
		let model = new Conversation(data)
		assert.deepEqual(ko.toJS(model), data)
	})
})
