import * as ko from 'knockout'
import assert from 'assert'
import StandardMessageForm from './StandardMessageForm'
import AbstractMessageForm from './AbstractMessageForm'

describe('StandardMessageForm', () => {
	it('should be instantiable', () => {
		let model = new StandardMessageForm(new ko.subscribable())
		assert.equal(model instanceof StandardMessageForm, true)
		assert.equal(model instanceof AbstractMessageForm, true)
	})
})
