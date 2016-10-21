import * as generator from '../../../db'
import * as ko from 'knockout'
import assert from 'assert'
import OfferMessageForm from './OfferMessageForm'
import OfferMessage from '../OfferMessage'
import * as constants from '../../constants'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

const api = 'http://sample.com'

describe('OfferMessageForm', () => {
	const conversationId = 1
	const text = 'Hello World'
	const vacancyId = 1

	let model
	let dispatcher
	let mock

	before(() => {
		global.api = api
	})

	beforeEach(() => {
		mock = new MockAdapter(axios)
		dispatcher = new ko.subscribable()
		model = new OfferMessageForm(dispatcher)
	})

	it('should be instantiable', () => {
		assert.equal(model instanceof OfferMessageForm, true)
	})

	it('should have vacancyId prop', () => {
		assert.equal(ko.isObservable(model.vacancyId), true)
	})

	it('should have save method', () => {
		assert.equal(typeof model.save, 'function')
	})

	it('should not try save message without conversationId', () => {
		model.vacancyId(1)
		assert.throws(() => model.save(), Error)
	})

	it('should not try save message without vacancyId', () => {
		model.conversationId(1)
		assert.throws(() => model.save(), Error)
	})

	const arrangeForSaveTest = () => {
		model.conversationId(conversationId)
		model.text(text)
		model.vacancyId(vacancyId)

		mock.onPost(`${api}/messages`).reply(200, {
			conversationId,
			text,
			vacancyId,
			id: 1,
			type: constants.OFFER_MESSAGE,
			date: (new Date()).toISOString()
		})
	}

	it(`should call api on save`, () => {
		arrangeForSaveTest()

		return model.save().then(message => {
			assert.equal(message instanceof OfferMessage, true)
			assert.equal(message.text(), text)
			assert.equal(message.vacancyId(), vacancyId)
			assert.equal(message.conversationId(), conversationId)
			assert.equal(message.id(), 1)
		})
	})

	it('should reset form on successful save', () => {
		arrangeForSaveTest()

		return model.save().then(() => {
			assert.equal(model.text(), '')
			assert.equal(model.vacancyId(), 0)
		})
	})

	it(`should fire ${constants.NEW_MESSAGE} on successful save`, () => {
		let counter = 0

		dispatcher.subscribe(() => {
			counter = counter + 1
		}, null, constants.NEW_MESSAGE)

		arrangeForSaveTest()

		return model.save().then(() => {
			assert.equal(counter, 1)
		})
	})

	it('should have template been set in constructor', () => {
		assert.equal(model.template(), 'OfferMessageForm')
	})


	describe('vacancies', () => {
		it('should have vacancies observable array', () => {
			assert.ok(ko.isObservable(model.vacancies))
			assert.equal(typeof model.vacancies.push, 'function')
			assert.equal(model.vacancies().length, 0)
		})

		it('should have hasVacancies comp', () => {
			assert.ok(ko.isComputed(model.hasVacancies))
			assert.equal(model.hasVacancies(), false)
			model.vacancies([generator.generateVacancy()])
			assert.equal(model.hasVacancies(), true)
		})

		it('should have fetchVacancies method', () => {
			assert.equal(typeof model.fetchVacancies, 'function')

			assert.equal(model.vacancies().length, 0)

			mock.onGet(`${api}/vacancies`).reply(200, [
				generator.generateVacancy(),
				generator.generateVacancy()
			])

			return model.fetchVacancies().then(() => {
				assert.equal(model.vacancies().length, 2)
			})
		})
	})
})
