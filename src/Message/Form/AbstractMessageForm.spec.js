import * as actions from '../../constants'
import * as ko from 'knockout'
import assert from 'assert'
import AbstractMessageForm from './AbstractMessageForm'

describe('AbstractMessageForm', () => {
	let model
	let dispatcher

	beforeEach(() => {
		dispatcher = new ko.subscribable()
		model = new AbstractMessageForm(dispatcher)
	})

	it('should be instantiable', () => {
		assert.equal(model instanceof AbstractMessageForm, true)
	})

	it('should throw an error if dispatcher not given', () => {
		// noinspection JSCheckFunctionSignatures
		assert.throws(() => new AbstractMessageForm(), Error)
	})

	it('should have dispatcher prop', () => {
		assert.equal(ko.isSubscribable(model.dispatcher), true)
	})

	it('should have text prop', () => {
		model.text('text')
		assert.equal(ko.isObservable(model.text), true)
		assert.equal(model.text(), 'text')
	})

	it('should have conversationId prop', () => {
		assert.equal(ko.isObservable(model.conversationId), true)
	})

	it(`should handle ${actions.CONVERSATION_SELECTED} event`, () => {
		let conversationId = 1
		dispatcher.notifySubscribers(conversationId, actions.CONVERSATION_SELECTED)
		assert.equal(model.conversationId(), conversationId)
	})

	it(`should call reset method if any on ${actions.CONVERSATION_SELECTED} event`, () => {
		model.text('Hello')
		model.reset = () => model.text('')
		let conversationId = 1
		dispatcher.notifySubscribers(conversationId, actions.CONVERSATION_SELECTED)
		assert.equal(model.text(), '')
	})

	it('should have template prop', () => {
		assert.ok(ko.isObservable(model.template))
	})

	it('should have hasConversationId comp', () => {
		assert.ok(ko.isComputed(model.hasConversationId))

		assert.equal(model.hasConversationId(), false)
		model.conversationId(1)
		assert.equal(model.hasConversationId(), true)
	})
})
