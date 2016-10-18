import * as ko from 'knockout'
import assert from 'assert'
import OfferMessageForm from './OfferMessageForm'
import OfferMessage from '../OfferMessage'
import * as types from '../types'
import * as actions from '../../actions'
import $ from 'jquery'
import jQueryMockAjax from 'jquery-mockjax'

const api = 'http://sample.com'
const mockjax = jQueryMockAjax($, window)
$.mockjaxSettings.logging = 0

describe('OfferMessageForm', () => {
	let model
	let dispatcher

	before(() => {
		global.api = api
	})

	beforeEach(() => {
		dispatcher = new ko.subscribable()
		model = new OfferMessageForm(dispatcher)
	})

	afterEach(() => mockjax.clear())

	it('should be instantiable', () => {
		assert.equal(model instanceof OfferMessageForm, true)
	})

	it('should have vacancyId prop', () => {
		assert.equal(ko.isObservable(model.vacancyId), true)
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
		let vacancyId = 1

		model.conversationId(conversationId)
		model.text(text)
		model.vacancyId(vacancyId)

		mockjax({
			type: 'post',
			url: `${api}/messages`,
			responseText: {
				conversationId,
				text,
				vacancyId,
				id: 1,
				type: types.OFFER,
				date: (new Date()).toISOString()
			}
		})

		return model.save().then(message => {
			assert.equal(message instanceof OfferMessage, true)
			assert.equal(message.text(), text)
			assert.equal(message.vacancyId(), vacancyId)
			assert.equal(message.conversationId(), conversationId)
			assert.equal(message.id(), 1)
		})
	})

	it('should reset form on successful save', () => {
		let conversationId = 1
		let text = 'Hello World'
		let vacancyId = 1

		model.conversationId(conversationId)
		model.text(text)
		model.vacancyId(vacancyId)

		mockjax({
			type: 'post',
			url: `${api}/messages`,
			responseText: {
				conversationId,
				text,
				vacancyId,
				id: 1,
				type: types.OFFER,
				date: (new Date()).toISOString()
			}
		})

		return model.save().then(() => {
			assert.equal(model.text(), '')
			assert.equal(model.vacancyId(), 0)
		})
	})

	it(`should fire ${actions.NEW_MESSAGE} on successful save`, () => {
		let counter = 0

		dispatcher.subscribe(() => {
			counter = counter + 1
		}, null, actions.NEW_MESSAGE)

		let conversationId = 1
		let text = 'Hello World'
		let vacancyId = 1

		model.conversationId(conversationId)
		model.text(text)
		model.vacancyId(vacancyId)

		mockjax({
			type: 'post',
			url: `${api}/messages`,
			responseText: {
				conversationId,
				text,
				vacancyId,
				id: 1,
				type: types.OFFER,
				date: (new Date()).toISOString()
			}
		})

		return model.save().then(() => {
			assert.equal(counter, 1)
		})
	})
})
