import assert from 'assert'
import InviteMessage from './InviteMessage'

describe('InviteMessage', () => {
	it('should be instantiable', () => {
		let model = new InviteMessage()
		assert.equal(model instanceof InviteMessage, true)
	})
})
