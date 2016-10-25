import * as ko from 'knockout'
import Templates from '../src/Templates/Templates'

export const model = new Templates(new ko.subscribable())

export const init = () => {
	const root = document.getElementById('templates')
	root.innerHTML = require('../src/Templates/Templates.html')
	ko.applyBindings(model, root)
	window['model'] = model
}
