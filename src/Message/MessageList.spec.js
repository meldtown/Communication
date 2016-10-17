// import * as types from './types'
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

	it('should have fetch method', () => {
		assert.equal(typeof model.fetch, 'function')
	})

	it('should map fetched messages', () => {
		// let data = [
		// 	{type: types.STANDARD, id: 1, date: '2015-04-24T23:04:59', conversationId: 1, text: 'Hello World'},
		// 	{type: types.INVITE,  id: 1, date: '2015-04-24T23:04:59', conversationId: 1, text: 'Hello World'}
		// ]
	})
})
