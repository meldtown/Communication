import * as ko from 'knockout'
import assert from 'assert'
import StandardMessageForm from './StandardMessageForm'
import AbstractMessageForm from './AbstractMessageForm'
import $ from 'jquery'
import jQueryMockAjax from 'jquery-mockjax'
import * as types from '../types'
import * as actions from '../../actions'
import StandardMessage from '../StandardMessage'

const api = 'http://sample.com'
const mockjax = jQueryMockAjax($, window)
$.mockjaxSettings.logging = 0

describe('StandardMessageForm', () => {
	let model
	let dispatcher

	before(() => {
		global.api = api
	})

	beforeEach(() => {
		dispatcher = new ko.subscribable()
		model = new StandardMessageForm(dispatcher)
	})

	afterEach(() => mockjax.clear())

	it('should be instantiable', () => {
		assert.equal(model instanceof StandardMessageForm, true)
		assert.equal(model instanceof AbstractMessageForm, true)
	})

	it('should have save method', () => {
		assert.equal(typeof model.save, 'function')
	})

	it('should not try save message without conversationId', () => {
		assert.throws(() => model.save(), Error)
	})

	it(`should call api on save`, () => {
		let conversationId = 1
		let text = 'Hello World'

		model.conversationId(conversationId)
		model.text(text)

		mockjax({
			type: 'post',
			url: `${api}/messages`,
			responseText: {conversationId, text, id: 1, type: types.STANDARD, date: (new Date()).toISOString()}
		})

		return model.save().then(message => {
			assert.equal(message instanceof StandardMessage, true)
			assert.equal(message.text(), text)
			assert.equal(message.conversationId(), conversationId)
			assert.equal(message.id(), 1)
		})
	})

	it('should reset form on successful save', () => {
		let conversationId = 1
		let text = 'Hello World'

		model.conversationId(conversationId)
		model.text(text)

		mockjax({
			type: 'post',
			url: `${api}/messages`,
			responseText: {conversationId, text, id: 1, type: types.STANDARD, date: (new Date()).toISOString()}
		})

		return model.save().then(() => {
			assert.equal(model.text(), '')
		})
	})

	it(`should fire ${actions.NEW_MESSAGE} on successful save`, () => {
		let counter = 0

		dispatcher.subscribe(() => {
			counter = counter + 1
		}, null, actions.NEW_MESSAGE)

		let conversationId = 1
		let text = 'Hello World'

		model.conversationId(conversationId)
		model.text(text)

		mockjax({
			type: 'post',
			url: `${api}/messages`,
			responseText: {conversationId, text, id: 1, type: types.STANDARD, date: (new Date()).toISOString()}
		})

		return model.save().then(() => {
			assert.equal(counter, 1)
		})
	})
})
