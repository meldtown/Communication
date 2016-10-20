import * as generator from '../../db'
import * as ko from 'knockout'
import assert from 'assert'
import Accordion from './Accordion'
import MessageList from '../Message/MessageList'
import $ from 'jquery'
import jQueryMockAjax from 'jquery-mockjax'

const api = 'http://sample.com'
const mockjax = jQueryMockAjax($, window)
$.mockjaxSettings.logging = 0

describe('Accordion', () => {
	const conversationId = 1
	let model
	let dispatcher

	beforeEach(() => {
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
	})

	it('should have fetch method', () => {
		assert.equal(typeof model.fetch, 'function')
	})

	it('should call fetch on messages while fetching data', () => {
		let responseText = [
			generator.generateStandardMessage(1, conversationId),
			generator.generateApplyMessage(2, conversationId)
		]

		mockjax({
			url: `${api}/messages`,
			responseText
		})

		// return model.fetch().then(() => {
		// 	assert.equal(model.messages.messages().length, 2)
		// })
	})
})
