import * as ko from 'knockout'
import assert from 'assert'
import MessageList from './MessageList'

describe('MessageList', () => {
	let model

	beforeEach(() => {
		model = new MessageList()
	})

	it('should be instantiable', () => {
		assert.equal(model instanceof MessageList, true)
	})

	it('should have messages observable array', () => {
		assert.equal(ko.isObservable(model.messages), true)
		assert.equal(typeof model.messages.push, 'function')
	})

})
