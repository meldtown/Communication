import * as actions from '../actions'
import * as generator from '../../db'
import * as ko from 'knockout'
import $ from 'jquery'
import assert from 'assert'
import MessageList from './MessageList'
import jQueryMockAjax from 'jquery-mockjax'
import DeclineMessage from '../Message/DeclineMessage'
import OfferMessage from '../Message/OfferMessage'
import StandardMessage from '../Message/StandardMessage'
import InviteMessage from '../Message/InviteMessage'
import ApplyMessage from './ApplyMessage'

const api = 'http://sample.com'
const mockjax = jQueryMockAjax($, window)
$.mockjaxSettings.logging = 0

describe('MessageList', () => {
	let model
	let dispatcher

	before(() => {
		global.api = api
	})

	beforeEach(() => {
		dispatcher = new ko.subscribable()
		model = new MessageList(dispatcher)
	})

	afterEach(() => mockjax.clear())

	it('should be instantiable', () => {
		assert.equal(model instanceof MessageList, true)
	})

	it('should throw an error if dispatcher not given', () => {
		// noinspection JSCheckFunctionSignatures
		assert.throws(() => new Conversation(), Error)
	})

	it('should have dispatcher prop', () => {
		assert.equal(ko.isSubscribable(model.dispatcher), true)
	})

	it('should have conversationId prop', () => {
		assert.equal(ko.isObservable(model.conversationId), true)
	})

	it('should have messages observable array', () => {
		assert.equal(ko.isObservable(model.messages), true)
		assert.equal(typeof model.messages.push, 'function')
	})

	it('should have fetch method', () => {
		assert.equal(typeof model.fetch, 'function')
	})

	it('should map fetched messages', () => {
		let conversationId = 1

		model.conversationId(conversationId)

		let responseText = [
			generator.generateStandardMessage(1, conversationId),
			generator.generateInviteMessage(2, conversationId),
			generator.generateDeclineMessage(3, conversationId),
			generator.generateOfferMessage(4, conversationId),
			generator.generateApplyMessage(5, conversationId)
		]

		mockjax({
			url: `${api}/messages`,
			data: {conversationId},
			responseText
		})

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
		let conversationId = 1

		model.conversationId(conversationId)

		mockjax({
			url: `${api}/messages`,
			data: {conversationId},
			status: 500
		})

		model.messages([
			generator.generateStandardMessage(1, 1)
		])

		assert.equal(model.messages().length, 1)

		model.fetch().always(() => {
			assert.equal(model.messages().length, 0)
			done()
		})
	})

	it(`should handle ${actions.NEW_MESSAGE} event`, () => {
		let model1 = new MessageList(dispatcher)
		let model2 = new MessageList(dispatcher)

		model1.conversationId(1)
		model2.conversationId(2)

		assert.equal(model1.messages().length, 0)
		assert.equal(model2.messages().length, 0)

		let message = new DeclineMessage(generator.generateDeclineMessage(5, 2))
		dispatcher.notifySubscribers(message, actions.NEW_MESSAGE)

		assert.equal(model1.messages().length, 0)
		assert.equal(model2.messages().length, 1)
	})
})
