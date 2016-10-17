import assert from 'assert'
import StandardTemplateView from './StandardTemplateView'
import AbstractTemplate from '../AbstractTemplate'

describe('StandardTemplateView', () => {
	it('should be instantiable', () => {
		let model = new StandardTemplateView()
		assert.equal(model instanceof StandardTemplateView, true)
		assert.equal(model instanceof AbstractTemplate, true)
	})
})
