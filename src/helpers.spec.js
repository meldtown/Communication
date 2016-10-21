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
		})

		it('should return formatted time on good values', () => {
			let date = '2015-05-15T23:00:00'
			assert.equal(helpers.formattedTime(date), moment(date).format('HH:mm'))
		})
	})
})
