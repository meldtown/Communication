import $ from 'jquery'
import assert from 'assert'
import Hub from './Hub'
import jQueryMockAjax from 'jquery-mockjax'

const mockjax = jQueryMockAjax($, window)
$.mockjaxSettings.logging = 0


describe('Hub', () => {
    afterEach(() => mockjax.clear())

    it('should have default 0 for a', () => {
        let model = new Hub()
        assert.equal(model.numericA(), 0)
    })

    it('can mock ajax', done => {
        mockjax({
            url: 'https://jsonplaceholder.typicode.com/users',
            responseText: [1, 2, 3, 4]
        })

        let model = new Hub()
        model.fetch().then(() => {
            assert.equal(model.numericA(), 2)
            assert.equal(model.numericB(), 2)
            done()
        })
    })

    it('should set both values to zero on error catch while fetching', done => {
        mockjax({
            url: 'https://jsonplaceholder.typicode.com/users',
            status: 500
        })

        let model = new Hub()
        model.fetch().always(() => {
            assert.equal(model.numericA(), 1)
            assert.equal(model.numericB(), 1)
            done()
        })

    })
})