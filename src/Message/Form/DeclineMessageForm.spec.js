import * as ko from 'knockout'
import assert from 'assert'
import DeclineMessageForm from './DeclineMessageForm'
import DeclineMessage from '../DeclineMessage'
import * as types from '../../constants'
import * as actions from '../../constants'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

const api = 'http://sample.com'

describe('DeclineMessageForm', () => {
	const conversationId = 1
	const text = 'Hello World'

	let model
	let dispatcher
	let mock

	before(() => {
		global.api = api
	})

	beforeEach(() => {
		mock = new MockAdapter(axios)
		dispatcher = new ko.subscribable()
		model = new DeclineMessageForm(dispatcher)
	})

	//afterEach(() => mockjax.clear())

	it('should be instantiable', () => {
		assert.equal(model instanceof DeclineMessageForm, true)
	})

	it('should have save method', () => {
		assert.equal(typeof model.save, 'function')
	})

	it('should not try save message without conversationId', () => {
		assert.throws(() => model.save(), Error)
	})

	const arrangeForSaveTest = () => {
		model.conversationId(conversationId)
		model.text(text)

		mock.onPost(`${api}/messages`).reply(200, {
			conversationId,
			text,
			id: 1,
			type: types.DECLINE_MESSAGE,
			date: (new Date()).toISOString()
		})
	}

	it(`should call api on save`, () => {
		arrangeForSaveTest()

		return model.save().then(message => {
			assert.equal(message instanceof DeclineMessage, true)
			assert.equal(message.text(), text)
			assert.equal(message.conversationId(), conversationId)
			assert.equal(message.id(), 1)
		})
	})

	it('should reset form on successful save', () => {
		arrangeForSaveTest()

		return model.save().then(() => {
			assert.equal(model.text(), '')
		})
	})

	it(`should fire ${actions.NEW_MESSAGE} on successful save`, () => {
		let counter = 0

		dispatcher.subscribe(() => {
			counter = counter + 1
		}, null, actions.NEW_MESSAGE)

		arrangeForSaveTest()

		return model.save().then(() => {
			assert.equal(counter, 1)
		})
	})

	it('should have template been set in constructor', () => {
		assert.equal(model.template(), 'DeclineMessageForm')
	})
})
