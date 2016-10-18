import * as ko from 'knockout'
import assert from 'assert'
import AbstractMessage from './AbstractMessage'
import moment from 'moment'

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

	it('should have isRead prop', () => {
		assert.equal(ko.isObservable(model.isRead), true)
	})

	it('should accept data into constructor', () => {
		let data = {id: 1, date: '2015-04-24T23:04:59', conversationId: 1, text: 'Hello World', isRead: true}
		let model = new AbstractMessage(data)
		// noinspection JSUnusedLocalSymbols
		let {ago, formattedDate, formattedTime, ...actual} = ko.toJS(model)
		assert.deepEqual(actual, data)
	})

	it('should have ago comp', () => {
		assert.ok(ko.isComputed(model.ago))

		let yesterday = moment().subtract(1, 'day').format()
		let expected = moment(yesterday).fromNow()

		model.date(yesterday)

		assert.equal(model.ago(), expected)
	})

	it('should have formatted date comp', () => {
		assert.ok(ko.isComputed(model.formattedDate))

		let date = '2015-01-01T23:23:23'

		model.date(date)

		assert.equal(model.formattedDate(), moment(date).format('LL'))
	})

	it('should have formatted time comp', () => {
		assert.ok(ko.isComputed(model.formattedTime))

		let date = '2015-01-01T23:23:23'

		model.date(date)

		assert.equal(model.formattedTime(), moment(date).format('HH:mm'))
	})
})
