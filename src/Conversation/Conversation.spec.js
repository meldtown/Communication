import * as constants from '../constants'
import * as generator from '../../db'
import * as ko from 'knockout'
import assert from 'assert'
import Conversation from './Conversation'
import $ from 'jquery'
import jQueryMockAjax from 'jquery-mockjax'

const api = 'http://sample.com'
const mockjax = jQueryMockAjax($, window)
$.mockjaxSettings.logging = 0

describe('Conversation', () => {
	let model
	let dispatcher

	before(() => {
		global.api = api
	})

	beforeEach(() => {
		dispatcher = new ko.subscribable()
		model = new Conversation(dispatcher)
	})

	afterEach(() => mockjax.clear())

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
		var actual = ko.toJS(model);
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
		var conversationId = 1;

		model.id(conversationId)

		assert.equal(model.isSelected(), false)

		dispatcher.notifySubscribers(conversationId, constants.CONVERSATION_SELECTED)

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
		let conversationId = model.id()

		model.type(constants.ACTIVE_CONVERSATION)
		assert.equal(model.type(), constants.ACTIVE_CONVERSATION)

		mockjax({
			type: 'PUT',
			url: `${api}/conversations/${conversationId}`,
			data: {type: constants.BLOCKED_CONVERSATION}
		})

		return model.block().then(() => {
			assert.equal(model.type(), constants.BLOCKED_CONVERSATION)
		})
	})
})
