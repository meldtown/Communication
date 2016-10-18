import * as ko from 'knockout'
import $ from 'jquery'
import assert from 'assert'
import Hub from './Hub'
import jQueryMockAjax from 'jquery-mockjax'
import ConversationList from '../Conversation/ConversationList'

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
})
