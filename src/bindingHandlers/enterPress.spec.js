import * as ko from 'knockout'
import './enterPress'

describe('enterPress', () => {
	it('should catch enter press', () => {
		class Model {
			constructor() {
				this.result = ko.observable()
			}

			save() {
				this.result('saved')
			}
		}

		let model = new Model()

		document.body.innerHTML = `<input data-bind="enterPress: save" />`
		ko.applyBindings(model)

		let input = document.querySelector('input')

		// let keyboardEvent = document.createEvent('KeyboardEvent')
		// keyboardEvent[keyboardEvent.initKeyboardEvent ? 'initKeyboardEvent' : 'initKeyEvent']('keydown', true, true, window, false, false, false, false, 13, 0)
		// input.dispatchEvent(keyboardEvent)

		// $('input').trigger({type: 'keydown', which: 13})

		// assert.equal(model.result(), 'saved')
	})
})
