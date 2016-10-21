import assert from 'assert'
import AbstractTemplateView from './AbstractTemplateView'
import AbstractTemplate from '../AbstractTemplate'
import * as ko from 'knockout'
import * as actions from '../../constants'
import TemplateFactory from '../TemplateFactory'
import * as generator from '../../../db'

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

	it('should accept data into constuctor', () => {
		let data = generator.generateStandardTemplate(1)
		model = new AbstractTemplateView(dispatcher, data)

		assert.equal(model.id(), data.id)
		assert.equal(model.title(), data.title)
	})

	it('should have select method', () => {
		let model = new AbstractTemplateView(dispatcher, {id: 2, title: 'title', text: 'text', language: 'language'})
		assert.equal(typeof model.select === 'function', true)

		let stdTpl1 = TemplateFactory.create(dispatcher, generator.generateStandardTemplate(1))
		let stdTpl2 = TemplateFactory.create(dispatcher, generator.generateStandardTemplate(2))
		let invTpl1 = TemplateFactory.create(dispatcher, generator.generateInviteTemplate(3))
		let invTpl2 = TemplateFactory.create(dispatcher, generator.generateInviteTemplate(4))


		assert.equal(stdTpl1.isSelected(), false)
		assert.equal(stdTpl2.isSelected(), false)
		assert.equal(invTpl1.isSelected(), false)
		assert.equal(invTpl2.isSelected(), false)

		stdTpl1.select()
		assert.equal(stdTpl1.isSelected(), true)
		assert.equal(stdTpl2.isSelected(), false)
		assert.equal(invTpl1.isSelected(), false)
		assert.equal(invTpl2.isSelected(), false)

		stdTpl2.select()

		assert.equal(stdTpl1.isSelected(), false)
		assert.equal(stdTpl2.isSelected(), true)
		assert.equal(invTpl1.isSelected(), false)
		assert.equal(invTpl2.isSelected(), false)

		invTpl1.select()
		assert.equal(stdTpl1.isSelected(), false)
		assert.equal(stdTpl2.isSelected(), true)
		assert.equal(invTpl1.isSelected(), true)
		assert.equal(invTpl2.isSelected(), false)

	})


	it(`should react to ${actions.TEMPLATE_SELECTED} event`, () => {
		let model = TemplateFactory.create(dispatcher, generator.generateInviteTemplate(1))
		assert.equal(model.isSelected(), false)

		dispatcher.notifySubscribers(model, actions.TEMPLATE_SELECTED)

		assert.equal(model.isSelected(), true)
	})

	it(`should react to ${actions.TEMPLATE_SELECTED} event only if has same id`, () => {
		let tpl1 = TemplateFactory.create(dispatcher, generator.generateInviteTemplate(1))
		let tpl2 = TemplateFactory.create(dispatcher, generator.generateInviteTemplate(2))
		tpl2.isSelected(true)

		dispatcher.notifySubscribers(tpl2, actions.TEMPLATE_SELECTED)

		assert.equal(tpl1.isSelected(), false)
	})

	it(`should fire ${actions.TEMPLATE_SELECTED} event on select method`, () => {
		let counter = 0
		dispatcher.subscribe(template => counter += template.id(), null, actions.TEMPLATE_SELECTED)
		let tpl1 = TemplateFactory.create(dispatcher, generator.generateInviteTemplate(5))
		tpl1.select()
		assert.equal(counter, 5)
	})
})
