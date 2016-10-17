import * as types from './types'
import * as generator from '../../db'
import * as ko from 'knockout'
import $ from 'jquery'
import assert from 'assert'
import MessageList from './MessageList'
import jQueryMockAjax from 'jquery-mockjax'

const api = 'http://sample.com'
const mockjax = jQueryMockAjax($, window)
$.mockjaxSettings.logging = 0

describe('MessageList', () => {
	let model

	before(() => {
		global.api = api
	})

	beforeEach(() => {
		model = new MessageList()
	})

	afterEach(() => mockjax.clear())

	it('should be instantiable', () => {
		assert.equal(model instanceof MessageList, true)
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
		let responseText = [
			generator.generateStandardMessage(1, conversationId),
			generator.generateInviteMessage(2, conversationId),
			generator.generateDeclineMessage(3, conversationId),
			generator.generateOfferMessage(4, conversationId),
			generator.generateResponseMessage(5, conversationId)
		]

		mockjax({
			url: `${api}/messages`,
			data: {conversationId},
			responseText
		})

		return model.fetch(conversationId).then(() => {
			assert.equal(model.messages().length, 5)
			assert.deepEqual(Object.assign({}, ko.toJS(model.messages()[0]), {type: types.STANDARD}), responseText[0])
			assert.deepEqual(Object.assign({}, ko.toJS(model.messages()[1]), {type: types.INVITE}), responseText[1])
			assert.deepEqual(Object.assign({}, ko.toJS(model.messages()[2]), {type: types.DECLINE}), responseText[2])
			assert.deepEqual(Object.assign({}, ko.toJS(model.messages()[3]), {type: types.OFFER}), responseText[3])
			assert.deepEqual(Object.assign({}, ko.toJS(model.messages()[4]), {type: types.RESPONSE}), responseText[4])
		})
	})

	it('should reset messages on error', done => {
		let conversationId = 1
		mockjax({
			url: `${api}/messages`,
			data: {conversationId},
			status: 500
		})

		model.messages([
			generator.generateStandardMessage(1, 1)
		])

		assert.equal(model.messages().length, 1)

		model.fetch(conversationId).always(() => {
			assert.equal(model.messages().length, 0)
			done()
		})
	})
})
