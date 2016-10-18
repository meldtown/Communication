import $ from 'jquery'
import jQueryMockAjax from 'jquery-mockjax'
import * as ko from 'knockout'
import assert from 'assert'
import InviteMessageForm from './InviteMessageForm'
import InviteMessage from '../InviteMessage'
import AbstractMessageForm from './AbstractMessageForm'
import * as types from '../../types'
import * as actions from '../../actions'

const api = 'http://sample.com'
const mockjax = jQueryMockAjax($, window)
$.mockjaxSettings.logging = 0

describe('InviteMessageForm', () => {
	let model
	let dispatcher

	before(() => {
		global.api = api
	})

	beforeEach(() => {
		dispatcher = new ko.subscribable()
		model = new InviteMessageForm(dispatcher)
	})

	afterEach(() => mockjax.clear())

	it('should be instantiable', () => {
		assert.equal(model instanceof InviteMessageForm, true)
		assert.equal(model instanceof AbstractMessageForm, true)
	})

	it('should have inviteDate', () => {
		assert.equal(ko.isObservable(model.inviteDate), true)
	})

	it('should have addressId', () => {
		assert.equal(ko.isObservable(model.addressId), true)
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
		let inviteDate = (new Date()).toISOString()
		let addressId = 1

		model.conversationId(conversationId)
		model.text(text)
		model.inviteDate(inviteDate)
		model.addressId(addressId)

		mockjax({
			type: 'post',
			url: `${api}/messages`,
			responseText: {
				conversationId,
				text,
				inviteDate,
				addressId,
				id: 1,
				type: types.INVITE,
				date: (new Date()).toISOString()
			}
		})

		return model.save().then(message => {
			assert.equal(message instanceof InviteMessage, true)
			assert.equal(message.text(), text)
			assert.equal(message.inviteDate(), inviteDate)
			assert.equal(message.addressId(), addressId)
			assert.equal(message.conversationId(), conversationId)
			assert.equal(message.id(), 1)
		})
	})

	it('should reset form on successful save', () => {
		let conversationId = 1
		let text = 'Hello World'
		let inviteDate = (new Date()).toISOString()
		let addressId = 1

		model.conversationId(conversationId)
		model.text(text)
		model.inviteDate(inviteDate)
		model.addressId(addressId)

		mockjax({
			type: 'post',
			url: `${api}/messages`,
			responseText: {
				conversationId,
				text,
				inviteDate,
				addressId,
				id: 1,
				type: types.INVITE,
				date: (new Date()).toISOString()
			}
		})

		return model.save().then(() => {
			assert.equal(model.text(), '')
			assert.equal(model.addressId(), 0)
			assert.equal(model.inviteDate(), '')
		})
	})

	it(`should fire ${actions.NEW_MESSAGE} on successful save`, () => {
		let counter = 0

		dispatcher.subscribe(() => {
			counter = counter + 1
		}, null, actions.NEW_MESSAGE)

		let conversationId = 1
		let text = 'Hello World'
		let inviteDate = (new Date()).toISOString()
		let addressId = 1

		model.conversationId(conversationId)
		model.text(text)
		model.inviteDate(inviteDate)
		model.addressId(addressId)

		mockjax({
			type: 'post',
			url: `${api}/messages`,
			responseText: {
				conversationId,
				text,
				inviteDate,
				addressId,
				id: 1,
				type: types.INVITE,
				date: (new Date()).toISOString()
			}
		})

		return model.save().then(() => {
			assert.equal(counter, 1)
		})
	})
})
