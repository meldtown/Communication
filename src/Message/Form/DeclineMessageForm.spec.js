import assert from 'assert'
import DeclineMessageForm from './DeclineMessageForm'

describe('DeclineMessageForm', () => {
	it('should be instantiable', () => {
		let model = new DeclineMessageForm()
		assert.equal(model instanceof DeclineMessageForm, true)
	})
})
