import assert from 'assert'
import DeclineTemplateView from './DeclineTemplateView'
import AbstractTemplate from '../AbstractTemplate'
import AbstractTemplateView from './AbstractTemplateView'
import * as ko from 'knockout'

describe('DeclineTemplateView', () => {
	let model
	let dispatcher
	beforeEach(() => {
		dispatcher = new ko.subscribable()
		model = new DeclineTemplateView(dispatcher)
	})

	it('should be instantiable', () => {
		assert.equal(model instanceof DeclineTemplateView, true)
		assert.equal(model instanceof AbstractTemplateView, true)
		assert.equal(model instanceof AbstractTemplate, true)
	})

	it('should have template prop', () => {
		assert.equal(ko.isObservable(model.template), true)
		assert.equal((model.template()), 'DeclineTemplateForm')
	})
})
