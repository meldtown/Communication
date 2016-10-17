import * as ko from 'knockout'
import assert from 'assert'
import AbstractMessage from './AbstractMessage'

describe('AbstractMessage', () => {
	let model

	beforeEach(() => {
		model = new AbstractMessage()
	})

	it('should be instantiable', () => {
		let model = new AbstractMessage()
		assert.equal(model instanceof AbstractMessage, true)
	})

	it('should have id prop', () => {
		model.id(1)
		assert.equal(ko.isObservable(model.id), true)
		assert.equal(model.id(), 1)
	})

	it('should have date prop', () => {
		model.date('2016-05-25T23:05:59')
		assert.equal(ko.isObservable(model.date), true)
		assert.equal(model.date(), '2016-05-25T23:05:59')
	})

	it('should have conversationId prop', () => {
		model.conversationId(1)
		assert.equal(ko.isObservable(model.conversationId), true)
		assert.equal(model.conversationId(), 1)
	})

	it('should have text prop', () => {
		model.text('text')
		assert.equal(ko.isObservable(model.text), true)
		assert.equal(model.text(), 'text')
	})

	it('should accept data into constructor', () => {
		let data = {id: 1, date: '2015-04-24T23:04:59', conversationId: 1, text: 'Hello World'}
		let model = new AbstractMessage(data)
		assert.deepEqual(ko.toJS(model), data)
	})

	
})
