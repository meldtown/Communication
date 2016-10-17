import assert from 'assert'
import DeclineTemplateView from './DeclineTemplateView'
import AbstractTemplate from '../AbstractTemplate'

describe('DeclineTemplateView', () => {
	it('should be instantiable', () => {
		let model = new DeclineTemplateView()
		assert.equal(model instanceof DeclineTemplateView, true)
		assert.equal(model instanceof AbstractTemplate, true)
	})
})
