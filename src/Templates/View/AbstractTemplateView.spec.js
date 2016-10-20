import assert from 'assert'
import AbstractTemplateView from './AbstractTemplateView'
import AbstractTemplate from '../AbstractTemplate'
import * as ko from 'knockout'

describe('AbstractTemplateView', () => {
	let model
	let dispatcher
	beforeEach(() => {
		dispatcher = new ko.subscribable()
		model = new AbstractTemplateView(dispatcher)
	})
	it('should be instantiable', () => {
		assert.equal(model instanceof AbstractTemplateView, true)
		assert.equal(model instanceof AbstractTemplate, true)
	})

})
