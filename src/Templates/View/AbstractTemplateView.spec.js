import assert from 'assert'
import AbstractTemplateView from './AbstractTemplateView'
import AbstractTemplate from '../AbstractTemplate'

describe('AbstractTemplateView', () => {
	it('should be instantiable', () => {
		let model = new AbstractTemplateView()
		assert.equal(model instanceof AbstractTemplateView, true)
		assert.equal(model instanceof AbstractTemplate, true)
	})
})
