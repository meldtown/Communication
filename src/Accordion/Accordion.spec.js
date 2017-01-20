import * as generator from '../../db'
import * as ko from 'knockout'
import assert from 'assert'
import Accordion from './Accordion'
import MessageList from '../Message/MessageList'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import StandardMessageForm from '../Message/Form/StandardMessageForm'
import InviteMessageForm from '../Message/Form/InviteMessageForm'
import DeclineMessageForm from '../Message/Form/DeclineMessageForm'
import OfferMessageForm from '../Message/Form/OfferMessageForm'
import Conversation from '../Conversation/Conversation'

const api = 'http://sample.com'

describe('Accordion', () => {
	const chatId = 1

	let mock
	let model
	let dispatcher

	before(() => global['api'] = api)

	beforeEach(() => {
		mock = new MockAdapter(axios)
		dispatcher = new ko.subscribable()
		model = new Accordion(dispatcher, chatId)
	})

	it('should be instantiable', () => {
		assert.equal(model instanceof Accordion, true)
	})

	it('should throw an error if dispatcher not given', () => {
		// noinspection JSCheckFunctionSignatures
		assert.throws(() => new Accordion(undefined, chatId), Error)
	})

	it('should have dispatcher prop', () => {
		assert.equal(ko.isSubscribable(model.dispatcher), true)
	})

	it('should throw an error if chatId not given', () => {
		// noinspection JSCheckFunctionSignatures
		assert.throws(() => new Accordion(dispatcher), Error)
	})

	it('should have chatId prop', () => {
		assert.equal(ko.isSubscribable(model.chatId), true)
	})

	it('should have messages', () => {
		assert.equal(model.messages instanceof MessageList, true)
	})

	it('should change chatId in all places', () => {
		model.chatId(2)
		assert.equal(model.messages.chatId(), model.chatId())
		assert.equal(model.standardMessageForm.chatId(), model.chatId())
		assert.equal(model.inviteMessageForm.chatId(), model.chatId())
		assert.equal(model.declineMessageForm.chatId(), model.chatId())
		assert.equal(model.offerMessageForm.chatId(), model.chatId())
	})

	it('should have fetch method', () => {
		assert.equal(typeof model.fetch, 'function')
	})

	it('should call fetch on messages while fetching data', () => {
		let responseText = [
			generator.generateStandardMessage(1, chatId),
			generator.generateApplyMessage(2, chatId)
		]

		mock.onGet(`${api}/messages`).reply(200, responseText)

		return model.fetch().then(() => {
			assert.equal(model.messages.messages().length, 2)
		})
	})

	it('should call fetch on chatId change', () => {
		let counter = 0
		model.fetch = () => counter = counter + 1
		model.chatId(2)
		assert.equal(counter, 1)
	})

	it('should have standard message form', () => {
		assert.equal(model.standardMessageForm instanceof StandardMessageForm, true)
		assert.equal(model.standardMessageForm.chatId(), model.chatId())
	})

	it('should have invite message form', () => {
		assert.equal(model.inviteMessageForm instanceof InviteMessageForm, true)
		assert.equal(model.inviteMessageForm.chatId(), model.chatId())
	})

	it('should have decline message form', () => {
		assert.equal(model.declineMessageForm instanceof DeclineMessageForm, true)
		assert.equal(model.declineMessageForm.chatId(), model.chatId())
	})

	it('should have offer message form', () => {
		assert.equal(model.offerMessageForm instanceof OfferMessageForm, true)
		assert.equal(model.offerMessageForm.chatId(), model.chatId())
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

	it('should have conversation prop', () => {
		assert.ok(ko.isObservable(model.conversation))
		assert.ok(model.conversation() instanceof Conversation)
	})

	it('should have fetchConversation method', () => {
		assert.equal(typeof model.fetchConversation, 'function')

		mock.onGet(`${api}/conversations/${chatId}`).reply(200, generator.generateConversation(chatId, [generator.generateStandardMessage(1, chatId)]))

		model.fetchConversation().then(conversation => {
			assert.ok(conversation instanceof Conversation)
		})
	})
})
