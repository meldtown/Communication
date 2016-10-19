import * as generator from '../../db'
import * as actions from '../constants'
import * as ko from 'knockout'
import $ from 'jquery'
import assert from 'assert'
import Hub from './Hub'
import jQueryMockAjax from 'jquery-mockjax'
import ConversationList from '../Conversation/ConversationList'
import MessageList from '../Message/MessageList'
import StandardMessageForm from '../Message/Form/StandardMessageForm'
import InviteMessageForm from '../Message/Form/InviteMessageForm'
import DeclineMessageForm from '../Message/Form/DeclineMessageForm'
import OfferMessageForm from '../Message/Form/OfferMessageForm'
import Conversation from '../Conversation/Conversation'

const api = 'http://sample.com'
const mockjax = jQueryMockAjax($, window)
$.mockjaxSettings.logging = 0


describe('Hub', () => {
	let model
	let dispatcher

	before(() => {
		global.api = api
	})

	beforeEach(() => {
		dispatcher = new ko.subscribable()
		model = new Hub(dispatcher)
	})

	afterEach(() => mockjax.clear())

	it('should be instantiable', () => {
		assert.equal(model instanceof Hub, true)
	})

	it('should throw an error if dispatcher not given', () => {
		// noinspection JSCheckFunctionSignatures
		assert.throws(() => new Hub(), Error)
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

	it('should have invite message form', () => {
		assert.equal(model.inviteMessageForm instanceof InviteMessageForm, true)
	})

	it('should have decline message form', () => {
		assert.equal(model.declineMessageForm instanceof DeclineMessageForm, true)
	})

	it('should have offer message form', () => {
		assert.equal(model.offerMessageForm instanceof OfferMessageForm, true)
	})

	it('should have isStandardFormSelected prop', () => {
		assert.equal(ko.isObservable(model.isStandardFormSelected), true)
	})

	it('should have isInviteFormSelected prop', () => {
		assert.equal(ko.isObservable(model.isInviteFormSelected), true)
	})

	it('should have isDeclineFormSelected prop', () => {
		assert.equal(ko.isObservable(model.isDeclineFormSelected), true)
	})

	it('should have isOfferFormSelected prop', () => {
		assert.equal(ko.isObservable(model.isOfferFormSelected), true)
	})

	it('should have selectStandardForm method', () => {
		assert.equal(typeof model.selectStandardForm, 'function')
		model.selectStandardForm()
		assert.equal(model.isStandardFormSelected(), true)
	})

	it('should have selectInviteForm method', () => {
		assert.equal(typeof model.selectInviteForm, 'function')
		model.selectInviteForm()
		assert.equal(model.isInviteFormSelected(), true)
	})

	it('should have selectDeclineForm method', () => {
		assert.equal(typeof model.selectDeclineForm, 'function')
		model.selectDeclineForm()
		assert.equal(model.isDeclineFormSelected(), true)
	})

	it('should have selectOfferForm method', () => {
		assert.equal(typeof model.selectOfferForm, 'function')
		model.selectOfferForm()
		assert.equal(model.isOfferFormSelected(), true)
	})

	it('should have standard form selected by default', () => {
		assert.ok(model.isStandardFormSelected())
	})

	it('should have selectedConversation comp', () => {
		assert.ok(ko.isComputed(model.selectedConversation))

		let conversation = new Conversation(dispatcher, generator.generateConversation(1, []))
		conversation.select()
		model.conversations.conversations([conversation])

		assert.equal(model.selectedConversation().id(), 1)
	})

	it('should reset messages to empty array if there is no conversations', () => {
		// TODO: can not reproduce via code
	})
})
