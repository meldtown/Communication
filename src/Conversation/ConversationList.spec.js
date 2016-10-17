import * as ko from 'knockout'
import assert from 'assert'
import ConversationList from './ConversationList'

describe('ConversationList', () => {
	let model

	beforeEach(() => {
		model = new ConversationList()
	})

	it('should be instantiable', () => {
		assert.equal(model instanceof ConversationList, true)
	})

	it('should have conversations observable array', () => {
		assert.equal(ko.isObservable(model.conversations), true)
		assert.equal(typeof model.conversations.push, 'function')
	})

	it('should have fetch method', () => {
		assert.equal(typeof model.fetch, 'function')
	})

	
})
