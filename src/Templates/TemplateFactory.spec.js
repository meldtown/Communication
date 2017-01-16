import * as ko from 'knockout'
import * as types from '../constants'
import assert from 'assert'
import TemplateFactory from './TemplateFactory'
import StandardTemplateView from './View/StandardTemplateView'
import InviteTemplateView from './View/InviteTemplateView'
import OfferTemplateView from './View/OfferTemplateView'
import DeclineTemplateView from './View/DeclineTemplateView'
import * as generator from '../../db'


describe('TemplatesFactory', () => {
	it('should have static create method', () => {
		assert.equal(typeof TemplateFactory.create, 'function')
	})

	describe('create', () => {
		let data
		let dispatcher

		beforeEach(() => {
			data = {
				id: 1,
				name: 'Yeah',
				text: 'Great !!!',
				language: 'ru'
			}
			dispatcher = new ko.subscribable()
		})

		it('should throw an error if dispatcher not given', () => {
			// noinspection JSCheckFunctionSignatures
			assert.throws(() => TemplateFactory.create(), Error)
		})

		it(`should create ${types.STANDARD_MESSAGE} template`, () => {
			data.type = types.STANDARD_MESSAGE
			let expected = new StandardTemplateView(dispatcher, data)
			let actual = TemplateFactory.create(dispatcher, data)
			assert.deepEqual(ko.toJS(actual), ko.toJS(expected))
		})

		it(`should create ${types.INVITE_MESSAGE} template`, () => {
			data.type = types.INVITE_MESSAGE
			data.inviteDate = '2015-04-24T23:04:59'
			data.adressId = 2
			let expected = new InviteTemplateView(dispatcher, data)
			let actual = TemplateFactory.create(dispatcher, data)
			assert.deepEqual(ko.toJS(actual), ko.toJS(expected))
		})

		it(`should create ${types.DECLINE_MESSAGE} template`, () => {
			data.type = types.DECLINE_MESSAGE
			let expected = new DeclineTemplateView(dispatcher, data)
			let actual = TemplateFactory.create(dispatcher, data)
			assert.deepEqual(ko.toJS(actual), ko.toJS(expected))
		})

		it(`should create ${types.OFFER_MESSAGE} template`, () => {
			data.type = types.OFFER_MESSAGE
			let expected = new OfferTemplateView(dispatcher, data)
			let actual = TemplateFactory.create(dispatcher, data)
			assert.deepEqual(ko.toJS(actual), ko.toJS(expected))
		})

		it('should return null in all other cases', () => {
			assert.equal(TemplateFactory.create(dispatcher, {...data, type: 'UNKNOWN'}), null)
		})

		it('should map array', () => {
			let items = [
				generator.generateStandardTemplate(1),
				generator.generateInviteTemplate(2)
			]

			let models = items.map(TemplateFactory.create.bind(this, dispatcher))

			assert.ok(models[0] instanceof StandardTemplateView)
			assert.ok(models[1] instanceof InviteTemplateView)
		})
	})
})
