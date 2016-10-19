import assert from 'assert'
import Accordion from './Accordion'

describe('Accordion', () => {
	let model

	beforeEach(() => {
		model = new Accordion()
	})

	it('should be instantiable', () => {
		assert.equal(model instanceof Accordion, true)
	})
})
