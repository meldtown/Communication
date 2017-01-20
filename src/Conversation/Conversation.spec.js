import * as constants from '../constants'
import * as generator from '../../db'
import * as ko from 'knockout'
import assert from 'assert'
import Conversation from './Conversation'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import StandardMessage from '../Message/StandardMessage'

const api = 'http://sample.com'

describe('Conversation', () => {
	let mock
	let model
	let dispatcher

	before(() => {
		global['api'] = api
	})

	beforeEach(() => {
		mock = new MockAdapter(axios)
		dispatcher = new ko.subscribable()
		model = new Conversation(dispatcher)
	})

	it('should be instantiable', () => {
		assert.equal(model instanceof Conversation, true)
	})

	it('should have id prop', () => {
		model.id(1)
		assert.equal(ko.isObservable(model.id), true)
		assert.equal(model.id(), 1)
	})

	it('should have lastMessage prop', () => {
		assert.equal(ko.isObservable(model.lastMessage), true)
	})

	it('should have avatar prop', () => {
		assert.equal(ko.isObservable(model.avatar), true)
	})

	it('should take constructor params', () => {
		let data = {id: 1, avatar: 'http:/placehold.it/50x50', lastMessage: generator.generateStandardMessage(1, 1)}
		let model = new Conversation(dispatcher, data)
		let actual = ko.toJS(model)
		assert.equal(actual.id, data.id)
		assert.equal(actual.avatar, data.avatar)
		assert.deepEqual(actual.vacancy, data.vacancy)
	})

	it('should throw an error if dispatcher not given', () => {
		// noinspection JSCheckFunctionSignatures
		assert.throws(() => new Conversation(), Error)
	})

	it('should have dispatcher prop', () => {
		assert.equal(ko.isSubscribable(model.dispatcher), true)
	})

	it('should have isSelected prop', () => {
		assert.equal(ko.isObservable(model.isSelected), true)
	})

	it(`should react to ${constants.CONVERSATION_SELECTED} event`, () => {
		const chatId = 1

		model.id(chatId)

		assert.equal(model.isSelected(), false)

		dispatcher.notifySubscribers(chatId, constants.CONVERSATION_SELECTED)

		assert.equal(model.isSelected(), true)
	})

	it(`should react to ${constants.CONVERSATION_SELECTED} event only if has same id`, () => {
		model.id(2)
		model.isSelected(true)

		dispatcher.notifySubscribers(1, constants.CONVERSATION_SELECTED)

		assert.equal(model.isSelected(), false)
	})

	it('should have select method', () => {
		assert.equal(typeof model.select === 'function', true)

		let item1 = new Conversation(dispatcher, {id: 1})
		let item2 = new Conversation(dispatcher, {id: 2})

		assert.equal(item1.isSelected(), false)
		assert.equal(item2.isSelected(), false)

		item1.select()

		assert.equal(item1.isSelected(), true)
		assert.equal(item2.isSelected(), false)

		item2.select()

		assert.equal(item1.isSelected(), false)
		assert.equal(item2.isSelected(), true)
	})

	it('should have type prop', () => {
		assert.ok(ko.isObservable(model.type))
	})

	it('should accept type as constructor argument', () => {
		let model = new Conversation(dispatcher, {type: constants.BLOCKED_CONVERSATION})
		assert.equal(model.type(), constants.BLOCKED_CONVERSATION)
	})

	it('should have block method', () => {
		assert.equal(typeof model.block, 'function')
	})

	it('should call backend to block conversation', () => {
		let chatId = 1

		model.id(chatId)
		model.type(constants.ACTIVE_CONVERSATION)
		assert.equal(model.type(), constants.ACTIVE_CONVERSATION)

		mock.onPut(`${api}/conversations/${chatId}`, {type: constants.BLOCKED_CONVERSATION}).reply(200)

		return model.block().then(() => {
			assert.equal(model.type(), constants.BLOCKED_CONVERSATION)
		})
	})

	it(`should fire ${constants.CONVERSATION_BLOCKED} event`, () => {
		let chatId = 1
		let counter = 0

		dispatcher.subscribe(() => {
			counter = counter + 1
		}, null, constants.CONVERSATION_BLOCKED)

		model.id(chatId)

		mock.onPut(`${api}/conversations/${chatId}`, {type: constants.BLOCKED_CONVERSATION}).reply(200)

		return model.block().then(() => {
			assert.equal(counter, 1)
		})
	})

	it('should have archive method', () => {
		assert.equal(typeof model.archive, 'function')
	})

	it('should call backend to archive conversation', () => {
		let chatId = 1

		model.id(chatId)
		model.type(constants.ACTIVE_CONVERSATION)
		assert.equal(model.type(), constants.ACTIVE_CONVERSATION)

		mock.onPut(`${api}/conversations/${chatId}`, {type: constants.ARCHIVED_CONVERSATION}).reply(200)

		return model.archive().then(() => {
			assert.equal(model.type(), constants.ARCHIVED_CONVERSATION)
		})
	})

	it(`should fire ${constants.CONVERSATION_ARCHIVED} event`, () => {
		let chatId = 1
		let counter = 0

		dispatcher.subscribe(() => {
			counter = counter + 1
		}, null, constants.CONVERSATION_ARCHIVED)

		model.id(chatId)

		mock.onPut(`${api}/conversations/${chatId}`, {type: constants.ARCHIVED_CONVERSATION}).reply(200)

		return model.archive().then(() => {
			assert.equal(counter, 1)
		})
	})

	it('should have activate method', () => {
		assert.equal(typeof model.activate, 'function')
	})

	it('should call backend to activate conversation', () => {
		let chatId = 1

		model.id(chatId)
		model.type(constants.BLOCKED_CONVERSATION)
		assert.equal(model.type(), constants.BLOCKED_CONVERSATION)

		mock.onPut(`${api}/conversations/${chatId}`, {type: constants.ACTIVE_CONVERSATION}).reply(200)

		return model.activate().then(() => {
			assert.equal(model.type(), constants.ACTIVE_CONVERSATION)
		})
	})

	it(`should fire ${constants.CONVERSATION_ACTIVATED} event`, () => {
		let chatId = 1
		let counter = 0

		dispatcher.subscribe(() => {
			counter = counter + 1
		}, null, constants.CONVERSATION_ACTIVATED)

		model.id(chatId)

		mock.onPut(`${api}/conversations/${chatId}`, {type: constants.ACTIVE_CONVERSATION}).reply(200)

		return model.activate().then(() => {
			assert.equal(counter, 1)
		})
	})

	it('should have isActive prop', () => {
		assert.ok(ko.isObservable(model.isActive))
		model.type(constants.ACTIVE_CONVERSATION)
		assert.equal(model.isActive(), true)
	})

	it('should have isArchived prop', () => {
		assert.ok(ko.isObservable(model.isArchived))
		model.type(constants.ARCHIVED_CONVERSATION)
		assert.equal(model.isArchived(), true)
	})

	it('should have isBlocked prop', () => {
		assert.ok(ko.isObservable(model.isBlocked))
		model.type(constants.BLOCKED_CONVERSATION)
		assert.equal(model.isBlocked(), true)
	})

	it('should have unread messages counter', () => {
		assert.ok(ko.isObservable(model.unreadMessagesCount))

		model = new Conversation(dispatcher, {unreadMessagesCount: 5})
		assert.equal(model.unreadMessagesCount(), 5)
	})

	it('should map last message', () => {
		model = new Conversation(dispatcher, {lastMessage: generator.generateStandardMessage(1, 1)})
		assert.ok(model.lastMessage() instanceof StandardMessage)
	})

	it('should have fullName prop', () => {
		assert.ok(ko.isObservable(model.fullName))

		model = new Conversation(dispatcher, {fullName: 'sample'})
		assert.equal(model.fullName(), 'sample')
	})

	it('should have lastMessageTemplate comp', () => {
		assert.ok(ko.isComputed(model.lastMessageTemplate))
		model = new Conversation(dispatcher, {lastMessage: generator.generateStandardMessage(1, 1)})
		assert.equal(model.lastMessageTemplate(), 'StandardMessagePreview')
	})

	it('should have vacancies array for filtering', () => {
		assert.ok(ko.isObservable(model.vacancies))
		assert.equal(typeof model.vacancies.push, 'function')
	})

	it('should by default set vacancies to empty array', () => {
		assert.equal(model.vacancies().length, 0)
	})

	it('should set vacancies from constructor', () => {
		const vacancies = [1, 2]
		model = new Conversation(dispatcher, {vacancies})
		assert.equal(model.vacancies().length, 2)
		assert.deepEqual(model.vacancies(), vacancies)
	})

	it('should have hasInvites prop', () => {
		assert.ok(ko.isObservable(model.hasInvites))
		model = new Conversation(dispatcher, {hasInvites: true})
		assert.ok(model.hasInvites())
	})

	it('should have hasDeclines prop', () => {
		assert.ok(ko.isObservable(model.hasDeclines))
		model = new Conversation(dispatcher, {hasDeclines: true})
		assert.ok(model.hasDeclines())
	})

	it('should have hasOffers prop', () => {
		assert.ok(ko.isObservable(model.hasOffers))
		model = new Conversation(dispatcher, {hasOffers: true})
		assert.ok(model.hasOffers())
	})

	it('should have fromCvdb prop', () => {
		assert.ok(ko.isObservable(model.fromCvdb))
		model = new Conversation(dispatcher, {fromCvdb: true})
		assert.ok(model.fromCvdb())
	})

	it('should have fromApply prop', () => {
		assert.ok(ko.isObservable(model.fromApply))
		model = new Conversation(dispatcher, {fromApply: true})
		assert.ok(model.fromApply())
	})
})
