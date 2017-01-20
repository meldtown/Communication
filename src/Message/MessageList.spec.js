import * as actions from '../constants'
import * as generator from '../../db'
import * as ko from 'knockout'
import axios from 'axios'
import assert from 'assert'
import MessageList from './MessageList'
import MockAdapter from 'axios-mock-adapter'
import DeclineMessage from '../Message/DeclineMessage'
import OfferMessage from '../Message/OfferMessage'
import StandardMessage from '../Message/StandardMessage'
import InviteMessage from '../Message/InviteMessage'
import ApplyMessage from './ApplyMessage'

const api = 'http://sample.com'

describe('MessageList', () => {
	let mock
	let model
	let dispatcher

	before(() => {
		global['api'] = api
	})

	beforeEach(() => {
		mock = new MockAdapter(axios)
		dispatcher = new ko.subscribable()
		model = new MessageList(dispatcher)
	})


	it('should be instantiable', () => {
		assert.equal(model instanceof MessageList, true)
	})

	it('should throw an error if dispatcher not given', () => {
		// noinspection JSCheckFunctionSignatures
		assert.throws(() => new MessageList(), Error)
	})

	it('should have dispatcher prop', () => {
		assert.equal(ko.isSubscribable(model.dispatcher), true)
	})

	it('should have chatId prop', () => {
		assert.equal(ko.isObservable(model.chatId), true)
	})

	it('should have messages observable array', () => {
		assert.equal(ko.isObservable(model.messages), true)
		assert.equal(typeof model.messages.push, 'function')
	})

	it('should have fetch method', () => {
		assert.equal(typeof model.fetch, 'function')
	})

	it('should map fetched messages', () => {
		let chatId = 1

		model.chatId(chatId)

		let responseText = [
			generator.generateStandardMessage(1, chatId),
			generator.generateInviteMessage(2, chatId),
			generator.generateDeclineMessage(3, chatId),
			generator.generateOfferMessage(4, chatId),
			generator.generateApplyMessage(5, chatId)
		]

		mock.onGet(`${api}/messages`).reply(200, responseText)

		return model.fetch().then(() => {
			let messages = model.messages()
			assert.equal(messages.length, 5)
			assert.ok(messages[0] instanceof StandardMessage)
			assert.ok(messages[1] instanceof InviteMessage)
			assert.ok(messages[2] instanceof DeclineMessage)
			assert.ok(messages[3] instanceof OfferMessage)
			assert.ok(messages[4] instanceof ApplyMessage)
		})
	})

	it('should reset messages on error', done => {
		let chatId = 1

		model.chatId(chatId)

		mock.onGet(`${api}/messages`).reply(500, 'error')

		model.messages([
			generator.generateStandardMessage(1, 1)
		])

		assert.equal(model.messages().length, 1)

		model.fetch().then(() => {
			assert.equal(model.messages().length, 0)
			done()
		})
	})

	it(`should handle ${actions.NEW_MESSAGE} event`, () => {
		let model1 = new MessageList(dispatcher)
		let model2 = new MessageList(dispatcher)

		model1.chatId(1)
		model2.chatId(2)

		assert.equal(model1.messages().length, 0)
		assert.equal(model2.messages().length, 0)

		let message = new DeclineMessage(generator.generateDeclineMessage(5, 2))
		dispatcher.notifySubscribers(message, actions.NEW_MESSAGE)

		assert.equal(model1.messages().length, 0)
		assert.equal(model2.messages().length, 1)
	})

	it('should have hasMessages computed', () => {
		assert.ok(ko.isComputed(model.hasMessages))

		assert.equal(model.hasMessages(), false)

		model.messages([new StandardMessage(generator.generateStandardMessage(1, 1))])

		assert.equal(model.hasMessages(), true)
	})
})
