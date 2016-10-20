import * as constants from '../constants'
import * as generator from '../../db'
import * as ko from 'knockout'
import assert from 'assert'
import ConversationService from './ConversationService'
import BaseService from './BaseService'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import Conversation from '../Conversation/Conversation'

const api = 'http://sample.com'

describe('ConversationService', () => {
	let mock
	let dispatcher
	let service

	beforeEach(() => {
		mock = new MockAdapter(axios)
		dispatcher = new ko.subscribable()
		service = new ConversationService(dispatcher, api)
	})

	it('should be instantiable', () => {
		assert.ok(service instanceof ConversationService)
		assert.ok(service instanceof BaseService)
	})

	describe('fetch', () => {
		it('should have fetch method', () => {
			assert.equal(typeof service.fetch, 'function')
		})

		it('should map result', () => {
			let conversationId = 1

			mock.onGet(`${api}/conversations/${conversationId}`).reply(200, generator.generateConversation(conversationId, [generator.generateStandardMessage(1, conversationId)]))

			return service.fetch(conversationId).then(conversation => {
				assert.ok(conversation instanceof Conversation)
				assert.equal(conversation.id(), conversationId)
			})
		})

		it('should fetch all active conversations if conversationId not given', () => {
			mock.onGet(`${api}/conversations`).reply(config => {
				if (config.params.type === constants.ACTIVE_CONVERSATION) {
					return [200, [generator.generateConversation(1, [generator.generateStandardMessage(1, 1)])]]
				} else {
					return [200, []]
				}
			})

			return service.fetch().then(conversations => {
				assert.equal(conversations.length, 1)
				assert.ok(conversations[0] instanceof Conversation)
				assert.equal(conversations[0].id(), 1)
			})
		})

		it('should fetch conversations by type', () => {
			mock.onGet(`${api}/conversations`).reply(config => {
				if (config.params.type === constants.BLOCKED_CONVERSATION) {
					return [200, [generator.generateConversation(1, [generator.generateStandardMessage(1, 1)]),]]
				} else {
					return [200, []]
				}
			})

			return service.fetch(constants.BLOCKED_CONVERSATION).then(conversations => {
				assert.equal(conversations.length, 1)
				assert.ok(conversations[0] instanceof Conversation)
				assert.equal(conversations[0].id(), 1)
			})
		})
	})

	describe('archive', () => {
		it('should have archive method', () => {
			assert.equal(typeof service.archive, 'function')
		})

		it('should throw an error if conversationId not given', () => {
			// noinspection JSCheckFunctionSignatures
			assert.throws(() => service.archive(), Error)
		})

		it('should call backend with proper params and return promise', () => {
			let conversationId = 1

			mock.onPut(`${api}/conversations/${conversationId}`, {body: {type: constants.ARCHIVED_CONVERSATION}}).reply(200)

			return service.archive(conversationId).then(() => {
				assert.ok(true)
			})
		})
	})

	describe('block', () => {
		it('should have block method', () => {
			assert.equal(typeof service.block, 'function')
		})

		it('should throw an error if conversationId not given', () => {
			// noinspection JSCheckFunctionSignatures
			assert.throws(() => service.block(), Error)
		})

		it('should call backend with proper params and return promise', () => {
			let conversationId = 1

			mock.onPut(`${api}/conversations/${conversationId}`, {body: {type: constants.BLOCKED_CONVERSATION}}).reply(200)

			return service.block(conversationId).then(() => {
				assert.ok(true)
			})
		})
	})

	describe('activate', () => {
		it('should have activate method', () => {
			assert.equal(typeof service.activate, 'function')
		})

		it('should throw an error if conversationId not given', () => {
			// noinspection JSCheckFunctionSignatures
			assert.throws(() => service.activate(), Error)
		})

		it('should call backend with proper params and return promise', () => {
			let conversationId = 1

			mock.onPut(`${api}/conversations/${conversationId}`, {body: {type: constants.ACTIVE_CONVERSATION}}).reply(200)

			return service.activate(conversationId).then(() => {
				assert.ok(true)
			})
		})
	})
})
