import AbstractTemplateView from './AbstractTemplateView'
import assert from 'assert'
import StandardTemplateView from './StandardTemplateView'
import AbstractTemplate from '../AbstractTemplate'
import * as ko from 'knockout'

describe('StandardTemplateView', () => {
	let model
	let dispatcher

	beforeEach(() => {
		dispatcher = new ko.subscribable()
		model = new StandardTemplateView(dispatcher)
	})

	it('should be instantiable', () => {
		assert.equal(model instanceof StandardTemplateView, true)
		assert.equal(model instanceof AbstractTemplateView, true)
		assert.equal(model instanceof AbstractTemplate, true)
	})

	it('should have template prop', () => {
		assert.equal(ko.isObservable(model.template), true)
		assert.equal((model.template()), 'StandardTemplateForm')
	})
})
