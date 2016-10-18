import * as ko from 'knockout'
import assert from 'assert'
import DeclineMessageForm from './DeclineMessageForm'

describe('DeclineMessageForm', () => {
	it('should be instantiable', () => {
		let model = new DeclineMessageForm(new ko.subscribable())
		assert.equal(model instanceof DeclineMessageForm, true)
	})
})
