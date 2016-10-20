import * as ko from 'knockout'
import assert from 'assert'
import Header from './Header'
import ConversationList from '../Conversation/ConversationList'

const api = 'http://sample.com'

describe('Header', () => {
	let model
	let dispatcher

	before(() => global.api = api)

	beforeEach(() => {
		dispatcher = new ko.subscribable()
		model = new Header(dispatcher)
	})

	it('should be instantiable', () => {
		assert.ok(model instanceof Header)
	})

	it('should throw an error if dispatcher not given', () => {
		// noinspection JSCheckFunctionSignatures
		assert.throws(() => new Header(), Error)
	})

	it('should have dispatcher prop', () => {
		assert.equal(ko.isSubscribable(model.dispatcher), true)
	})

	it('should conversations prop', () => {
		assert.ok(model.conversations instanceof ConversationList)
	})

	it('should have fetch method', () => {
		assert.ok(typeof model.fetch, 'function')
	})

	it('should fetch conversations', () => {
		let counter = 0
		model.conversations.fetch = () => counter = counter + 1
		model.fetch()
		assert.equal(counter, 1)
	})
})
