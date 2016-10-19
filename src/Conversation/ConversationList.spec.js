import * as types from '../constants'
import * as generator from '../../db'
import * as ko from 'knockout'
import $ from 'jquery'
import assert from 'assert'
import ConversationList from './ConversationList'
import jQueryMockAjax from 'jquery-mockjax'
import Conversation from './Conversation'

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
				// noinspection JSUnusedLocalSymbols
				var {ago, formattedDate, formattedTime, isJobsearcher, template, ...actual} = ko.toJS(conversation.lastMessage());
				assert.deepEqual({...actual, type: responseText[i].lastMessage.type}, responseText[i].lastMessage)
			}
		})
	})

	it('should reset conversations on error', done => {
		mockjax({
			url: `${api}/conversations`,
			status: 500
		})

		model.conversations([
			new Conversation(dispatcher, generator.generateConversation(1, [generator.generateStandardMessage(1, 1)]))
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

	it('should have isActiveSelected prop', () => {
		assert.ok(ko.isObservable(model.isActiveSelected))
	})

	it('should have isArchiveSelected prop', () => {
		assert.ok(ko.isObservable(model.isArchiveSelected))
	})

	it('should have isBlockedSelected prop', () => {
		assert.ok(ko.isObservable(model.isBlockedSelected))
	})

	it('should have selectActive method', () => {
		assert.equal(typeof model.selectActive, 'function')

		mockjax({
			url: `${api}/conversations`,
			data: {type: types.ACTIVE_CONVERSATION},
			responseText: []
		})

		return model.selectActive().then(() => {
			assert.equal(model.conversations().length, 0)
			assert.ok(model.isActiveSelected())
		})
	})

	it('should have selectArchive method', () => {
		assert.equal(typeof model.selectArchive, 'function')

		mockjax({
			url: `${api}/conversations`,
			data: {type: types.ARCHIVED_CONVERSATION},
			responseText: []
		})

		return model.selectArchive().then(() => {
			assert.equal(model.conversations().length, 0)
			assert.ok(model.isArchiveSelected())
		})
	})

	it('should have selectBlocked method', () => {
		assert.equal(typeof model.selectBlocked, 'function')

		mockjax({
			url: `${api}/conversations`,
			data: {type: types.BLOCKED_CONVERSATION},
			responseText: []
		})

		return model.selectBlocked().then(() => {
			assert.equal(model.conversations().length, 0)
			assert.ok(model.isBlockedSelected())
		})
	})

	it('should use selected type in fetch', () => {
		let archiveConversation = generator.generateConversation(1, [generator.generateStandardMessage(1, 1)])
		archiveConversation.type = types.ARCHIVED_CONVERSATION

		model.selectArchive()

		mockjax({
			url: `${api}/conversations`,
			data: {type: types.ARCHIVED_CONVERSATION},
			responseText: [archiveConversation]
		})

		return model.fetch().then(() => {
			assert.equal(model.conversations().length, 1)
		})
	})

	it('should call fetch on selected type change', () => {
		mockjax({
			url: `${api}/conversations`,
			data: {type: types.ARCHIVED_CONVERSATION},
			responseText: []
		})

		return model.selectArchive().then(() => {
			assert.equal(model.conversations().length, 0)
		})
	})

	it('should have term prop', () => {
		assert.ok(ko.isObservable(model.term))
	})

	it('should use term if not empty in fetch', () => {
		let term = 'php'

		model.term(term)

		mockjax({
			url: `${api}/conversations`,
			data: {type: types.ACTIVE_CONVERSATION, q: term},
			responseText: []
		})

		return model.fetch().then(() => {
			assert.equal(model.conversations().length, 0)
		})
	})

	it('should have empty conversation array at start', () => {
		assert.equal(model.conversations().length, 0)
	})

	it('should have selectedConversation comp', () => {
		assert.ok(ko.isComputed(model.selectedConversation))
	})

	it('should have hasInvitesSelected prop', () => {
		assert.ok(ko.isObservable(model.hasInvitesSelected))
	})

	it('should have hasDeclinesSelected prop', () => {
		assert.ok(ko.isObservable(model.hasDeclinesSelected))
	})

	it('should have hasOffersSelected prop', () => {
		assert.ok(ko.isObservable(model.hasOffersSelected))
	})

	describe('filteredConversations', () => {

		it('should have filteredConversations computed', () => {
			assert.ok(ko.isComputed(model.filteredConversations))
		})

		it('should respect hasInvitesSelected filter', () => {
			model.conversations([
				new Conversation(dispatcher, {hasInvites: false}),
				new Conversation(dispatcher, {hasInvites: true})
			])
			model.hasInvitesSelected(true)
			assert.equal(model.filteredConversations().length, 1)
			assert.ok(model.filteredConversations()[0].hasInvites())
		})

		it('should respect hasDeclinesSelected filter', () => {
			model.conversations([
				new Conversation(dispatcher, {hasDeclines: false}),
				new Conversation(dispatcher, {hasDeclines: true})
			])
			model.hasDeclinesSelected(true)
			assert.equal(model.filteredConversations().length, 1)
			assert.ok(model.filteredConversations()[0].hasDeclines())
		})

		it('should respect hasOffersSelected filter', () => {
			model.conversations([
				new Conversation(dispatcher, {hasOffers: false}),
				new Conversation(dispatcher, {hasOffers: true})
			])
			model.hasOffersSelected(true)
			assert.equal(model.filteredConversations().length, 1)
			assert.ok(model.filteredConversations()[0].hasOffers())
		})

		it('should chain filters', () => {
			model.conversations([
				new Conversation(dispatcher, {hasInvites: true, hasDeclines: false}),
				new Conversation(dispatcher, {hasInvites: false, hasDeclines: true})
			])

			model.hasInvitesSelected(true)
			model.hasDeclinesSelected(true)

			assert.equal(model.filteredConversations().length, 2)
		})

		it('should do nothing if non of filters checked', () => {
			model.conversations([
				new Conversation(dispatcher, {hasInvites: true, hasDeclines: false}),
				new Conversation(dispatcher, {hasInvites: false, hasDeclines: true})
			])

			assert.equal(model.filteredConversations().length, 2)
		})

		it('should reset filters on fetch', () => {
			model.hasInvitesSelected(true)
			model.hasDeclinesSelected(true)
			model.hasOffersSelected(true)

			mockjax({
				url: `${api}/conversations`,
				responseText: []
			})

			return model.fetch().then(() => {
				assert.equal(model.hasInvitesSelected(), false)
				assert.equal(model.hasDeclinesSelected(), false)
				assert.equal(model.hasOffersSelected(), false)
			})
		})
	})
})
