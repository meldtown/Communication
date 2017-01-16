import * as ko from 'knockout'
import assert from 'assert'
import AbstractTemplate from './AbstractTemplate'

describe('AbstractTemplate', () => {
	let model
	let dispatcher

	beforeEach(() => {
		dispatcher = new ko.subscribable()
		model = new AbstractTemplate(dispatcher)
	})

	it('should be instantiable', () => {
		let model = new AbstractTemplate(dispatcher)
		assert.equal(model instanceof AbstractTemplate, true)
	})

	it('should have id prop', () => {
		model.id(1)
		assert.equal(ko.isObservable(model.id), true)
		assert.equal(model.id(), 1)
	})

	it('should have name prop', () => {
		model.name('name')
		assert.equal(ko.isObservable(model.name), true)
		assert.equal(model.name(), 'name')
	})

	it('should have language prop', () => {
		model.language('ru')
		assert.equal(ko.isObservable(model.language), true)
		assert.equal(model.language(), 'ru')
	})

	it('should have text prop', () => {
		model.text('text')
		assert.equal(ko.isObservable(model.text), true)
		assert.equal(model.text(), 'text')
	})

	it('should accept data into constructor', () => {
		let data = {id: 1, language: 'ru', text: 'Hello World', name: 'name'}
		let model = new AbstractTemplate(dispatcher, data)
		assert.deepEqual(ko.toJS(model), {dispatcher, ...ko.toJS(model)})
	})
})
