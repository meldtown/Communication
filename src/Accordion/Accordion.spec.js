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

const api = 'http://sample.com'

describe('Accordion', () => {
	const conversationId = 1

	let mock
	let model
	let dispatcher

	before(() => global.api = api)

	beforeEach(() => {
		mock = new MockAdapter(axios)
		dispatcher = new ko.subscribable()
		model = new Accordion(dispatcher, conversationId)
	})

	it('should be instantiable', () => {
		assert.equal(model instanceof Accordion, true)
	})

	it('should throw an error if dispatcher not given', () => {
		// noinspection JSCheckFunctionSignatures
		assert.throws(() => new Accordion(undefined, conversationId), Error)
	})

	it('should have dispatcher prop', () => {
		assert.equal(ko.isSubscribable(model.dispatcher), true)
	})

	it('should throw an error if conversationId not given', () => {
		// noinspection JSCheckFunctionSignatures
		assert.throws(() => new Accordion(dispatcher), Error)
	})

	it('should have conversationId prop', () => {
		assert.equal(ko.isSubscribable(model.conversationId), true)
	})

	it('should have messages', () => {
		assert.equal(model.messages instanceof MessageList, true)
	})

	it('should change conversationId in all places', () => {
		model.conversationId(2)
		assert.equal(model.messages.conversationId(), model.conversationId())
		assert.equal(model.standardMessageForm.conversationId(), model.conversationId())
		assert.equal(model.inviteMessageForm.conversationId(), model.conversationId())
		assert.equal(model.declineMessageForm.conversationId(), model.conversationId())
		assert.equal(model.offerMessageForm.conversationId(), model.conversationId())
	})

	it('should have fetch method', () => {
		assert.equal(typeof model.fetch, 'function')
	})

	it('should call fetch on messages while fetching data', () => {
		let responseText = [
			generator.generateStandardMessage(1, conversationId),
			generator.generateApplyMessage(2, conversationId)
		]

		mock.onGet(`${api}/messages`).reply(200, responseText)

		return model.fetch().then(() => {
			assert.equal(model.messages.messages().length, 2)
		})
	})

	it('should call fetch on conversationId change', () => {
		let counter = 0
		model.fetch = () => counter = counter + 1
		model.conversationId(2)
		assert.equal(counter, 1)
	})

	it('should have standard message form', () => {
		assert.equal(model.standardMessageForm instanceof StandardMessageForm, true)
		assert.equal(model.standardMessageForm.conversationId(), model.conversationId())
	})

	it('should have invite message form', () => {
		assert.equal(model.inviteMessageForm instanceof InviteMessageForm, true)
		assert.equal(model.inviteMessageForm.conversationId(), model.conversationId())
	})

	it('should have decline message form', () => {
		assert.equal(model.declineMessageForm instanceof DeclineMessageForm, true)
		assert.equal(model.declineMessageForm.conversationId(), model.conversationId())
	})

	it('should have offer message form', () => {
		assert.equal(model.offerMessageForm instanceof OfferMessageForm, true)
		assert.equal(model.offerMessageForm.conversationId(), model.conversationId())
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
})
