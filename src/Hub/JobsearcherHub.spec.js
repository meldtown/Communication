import * as actions from '../constants'
import * as generator from '../../db'
import * as ko from 'knockout'
import assert from 'assert'
import JobsearcherHub from './JobsearcherHub'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import MessageList from '../Message/MessageList'
import ConversationList from '../Conversation/ConversationList'
import Conversation from '../Conversation/Conversation'
import StandardMessageForm from '../Message/Form/StandardMessageForm'

const api = 'http://sample.com'

describe('JobsearcherHub', () => {
	let mock
	let model
	let dispatcher

	before(() => {
		global['api'] = api
	})

	beforeEach(() => {
		mock = new MockAdapter(axios)
		dispatcher = new ko.subscribable()
		model = new JobsearcherHub(dispatcher)
	})

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

		mock.onGet(`${api}/conversations`).reply(200, [conversation1, conversation2])

		return model.fetch().then(() => {
			assert.equal(model.conversations.conversations().length, 2)
			assert.equal(model.conversations.conversations()[0].isSelected(), true)
		})
	})

	it(`should fetch messages on ${actions.CONVERSATION_SELECTED} event`, () => {
		let counter = 0
		let chatId = 5

		model.conversations.conversations([new Conversation(dispatcher, generator.generateConversation(chatId, []))])
		model.messages.fetch = () => counter = counter + 1

		dispatcher.notifySubscribers(chatId, actions.CONVERSATION_SELECTED)

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

	it('should reset messages and chatId if there is no conversations', () => {
		// Arrange
		let chatId = 1
		let conversation = new Conversation(dispatcher, generator.generateConversation(chatId, []))
		model.conversations.conversations([conversation])
		model.messages.chatId(chatId)
		model.standardMessageForm.chatId(chatId)
		model.messages.messages([conversation.lastMessage])

		// Act
		model.conversations.conversations([])

		// Assert
		assert.equal(model.messages.chatId(), null)
		assert.equal(model.standardMessageForm.chatId(), null)
		assert.equal(model.messages.messages().length, 0)
	})
})
