import assert from 'assert'
import StandardMessage from './StandardMessage'

describe('StandardMessage', () => {
	it('should be instantiable', () => {
		let model = new StandardMessage()
		assert.equal(model instanceof StandardMessage, true)
	})
})
