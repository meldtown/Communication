import * as actions from '../constants'
import * as generator from '../../db'
import * as ko from 'knockout'
import assert from 'assert'
import JobsearcherHub from './JobsearcherHub'
import $ from 'jquery'
import jQueryMockAjax from 'jquery-mockjax'
import MessageList from '../Message/MessageList'
import ConversationList from '../Conversation/ConversationList'
import Conversation from '../Conversation/Conversation'
import StandardMessageForm from '../Message/Form/StandardMessageForm'

const api = 'http://sample.com'
const mockjax = jQueryMockAjax($, window)
$.mockjaxSettings.logging = 0

describe('JobsearcherHub', () => {
	let model
	let dispatcher

	before(() => {
		global.api = api
	})

	beforeEach(() => {
		dispatcher = new ko.subscribable()
		model = new JobsearcherHub(dispatcher)
	})

	afterEach(() => mockjax.clear())

	it('should be instantiable', () => {
		assert.equal(model instanceof JobsearcherHub, true)
	})

	it('should throw an error if dispatcher not given', () => {
		// noinspection JSCheckFunctionSignatures
		assert.throws(() => new JobsearcherHub(), Error)
	})

	it('should have dispatcher prop', () => {
		assert.equal(ko.isSubscribable(model.dispatcher), true)
	})

	it('should have conversations', () => {
		assert.equal(model.conversations instanceof ConversationList, true)
	})

	it('should have messages', () => {
		assert.equal(model.messages instanceof MessageList, true)
	})

	it('should have fetch method', () => {
		assert.equal(typeof model.fetch, 'function')
	})

	it('should call fetch on conversations and messages while fetching data', () => {
		let messages1 = [
			generator.generateStandardMessage(1, 1),
			generator.generateApplyMessage(2, 1)
		]

		let messages2 = [
			generator.generateStandardMessage(3, 2),
			generator.generateApplyMessage(4, 2)
		]

		let conversation1 = generator.generateConversation(1, messages1)
		let conversation2 = generator.generateConversation(2, messages2)

		mockjax({
			url: `${api}/conversations`,
			responseText: [conversation1, conversation2]
		})

		return model.fetch().then(() => {
			assert.equal(model.conversations.conversations().length, 2)
			assert.equal(model.conversations.conversations()[0].isSelected(), true)
		})
	})

	it(`should fetch messages on ${actions.CONVERSATION_SELECTED} event`, () => {
		let counter = 0
		let conversationId = 5

		model.conversations.conversations([new Conversation(dispatcher, generator.generateConversation(conversationId, []))])
		model.messages.fetch = () => counter = counter + 1

		dispatcher.notifySubscribers(conversationId, actions.CONVERSATION_SELECTED)

		assert.equal(counter, 1)
	})

	it('should have standard message form', () => {
		assert.equal(model.standardMessageForm instanceof StandardMessageForm, true)
	})

	it('should have selectedConversation comp', () => {
		assert.ok(ko.isComputed(model.selectedConversation))

		let conversation = new Conversation(dispatcher, generator.generateConversation(1, []))
		conversation.select()
		model.conversations.conversations([conversation])

		assert.equal(model.selectedConversation().id(), 1)
	})

	it('should reset messages and conversationId if there is no conversations', () => {
		// Arrange
		let conversationId = 1
		let conversation = new Conversation(dispatcher, generator.generateConversation(conversationId, []))
		model.conversations.conversations([conversation])
		model.messages.conversationId(conversationId)
		model.standardMessageForm.conversationId(conversationId)
		model.messages.messages([conversation.lastMessage])

		// Act
		model.conversations.conversations([])

		// Assert
		assert.equal(model.messages.conversationId(), null)
		assert.equal(model.standardMessageForm.conversationId(), null)
		assert.equal(model.messages.messages().length, 0)
	})
})
