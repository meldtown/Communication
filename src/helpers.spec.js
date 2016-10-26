import assert from 'assert'
import * as helpers from './helpers'
import moment from 'moment'

describe('helpers', () => {
	describe('uniqueReducer', () => {
		it('should add only new values', () => {
			assert.deepEqual(helpers.uniqueReducer([1], 1), [1])
			assert.deepEqual(helpers.uniqueReducer([1], 2), [1, 2])
		})

		it('should handle undefined initial value', () => {
			assert.deepEqual(helpers.uniqueReducer(undefined, 1), [1])
		})
	})

	describe('formattedDate', () => {
		it('should handle null', () => {
			assert.equal(helpers.formattedDate(null), null)
			assert.equal(helpers.formattedDate(undefined), null)
			assert.equal(helpers.formattedDate(false), null)
			assert.equal(helpers.formattedDate(0), null)
			assert.equal(helpers.formattedDate('hello'), null)
		})

		it('should return formatted date on good values', () => {
			let date = '2015-05-15T23:00:00'
			assert.equal(helpers.formattedDate(date), moment(date).format('LL'))
		})
	})

	describe('formattedTime', () => {
		it('should handle null', () => {
			assert.equal(helpers.formattedTime(null), null)
			assert.equal(helpers.formattedTime(undefined), null)
			assert.equal(helpers.formattedTime(false), null)
			assert.equal(helpers.formattedTime(0), null)
			assert.equal(helpers.formattedTime('hello'), null)
		})

		it('should return formatted time on good values', () => {
			let date = '2015-05-15T23:00:00'
			assert.equal(helpers.formattedTime(date), moment(date).format('HH:mm'))
		})
	})

	describe('isoDateTime', () => {
		it('should handle null', () => {
			assert.equal(helpers.isoDateTime(null), null)
			assert.equal(helpers.isoDateTime(undefined), null)
			assert.equal(helpers.isoDateTime(false), null)
			assert.equal(helpers.isoDateTime(0), null)
			assert.equal(helpers.isoDateTime('hello'), null)
		})

		it('should return formatted time on good values', () => {
			let date = '2015-05-15T23:00:00'
			assert.equal(helpers.isoDateTime(date).indexOf(date), 0)
		})
	})

	describe('inputFormattedDate', () => {
		it('should handle null', () => {
			assert.equal(helpers.inputFormattedDate(null), null)
			assert.equal(helpers.inputFormattedDate(undefined), null)
			assert.equal(helpers.inputFormattedDate(false), null)
			assert.equal(helpers.inputFormattedDate(0), null)
			assert.equal(helpers.inputFormattedDate('hello'), null)
		})

		it('should return formatted value on good values', () => {
			let date = '2015-05-15T23:00:00'
			assert.equal(helpers.inputFormattedDate(date), '2015-05-15')
		})
	})
})
