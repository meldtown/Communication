import * as generator from '../../db'
import * as ko from 'knockout'
import $ from 'jquery'
import assert from 'assert'
import ConversationList from './ConversationList'
import jQueryMockAjax from 'jquery-mockjax'

const api = 'http://sample.com'
const mockjax = jQueryMockAjax($, window)
$.mockjaxSettings.logging = 0

describe('ConversationList', () => {
	let model
	let dispatcher

	before(() => {
		global.api = api
	})

	beforeEach(() => {
		dispatcher = new ko.subscribable()
		model = new ConversationList(dispatcher)
	})

	afterEach(() => mockjax.clear())

	it('should be instantiable', () => {
		assert.equal(model instanceof ConversationList, true)
	})

	it('should have conversations observable array', () => {
		assert.equal(ko.isObservable(model.conversations), true)
		assert.equal(typeof model.conversations.push, 'function')
	})

	it('should throw an error if dispatcher not given', () => {
		// noinspection JSCheckFunctionSignatures
		assert.throws(() => new Conversation(), Error)
	})

	it('should have dispatcher prop', () => {
		assert.equal(ko.isSubscribable(model.dispatcher), true)
	})

	it('should have fetch method', () => {
		assert.equal(typeof model.fetch, 'function')
	})

	it('should map fetched conversations', () => {
		let responseText = [
			generator.generateConversation(1, [generator.generateStandardMessage(1, 1)]),
			generator.generateConversation(2, [generator.generateDeclineMessage(1, 2)])
		]

		mockjax({
			url: `${api}/conversations`,
			responseText
		})

		return model.fetch().then(() => {
			assert.equal(model.conversations().length, responseText.length)
			for (let i = 0; i < responseText.length; i++) {
				let conversation = model.conversations()[i]
				assert.equal(conversation.id(), responseText[i].id)
				assert.deepEqual(conversation.lastMessage(), responseText[i].lastMessage)
			}
		})
	})

	it('should reset conversations on error', done => {
		mockjax({
			url: `${api}/conversations`,
			status: 500
		})

		model.conversations([
			generator.generateConversation(1, [generator.generateStandardMessage(1, 1)])
		])

		assert.equal(model.conversations().length, 1)

		model.fetch().always(() => {
			assert.equal(model.conversations().length, 0)
			done()
		})
	})

	it('should select first available conversation after fetch', () => {
		let responseText = [
			generator.generateConversation(1, [generator.generateStandardMessage(1, 1)]),
			generator.generateConversation(2, [generator.generateDeclineMessage(1, 2)])
		]

		mockjax({
			url: `${api}/conversations`,
			responseText
		})

		return model.fetch().then(() => {
			assert.equal(model.conversations()[0].isSelected(), true)
		})
	})

	it('should handle empty conversation list', () => {
		let responseText = []

		mockjax({
			url: `${api}/conversations`,
			responseText
		})

		return model.fetch().then(() => {
			assert.equal(model.conversations().length, 0)
		})
	})
})
