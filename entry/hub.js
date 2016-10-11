import * as ko from 'knockout'
import Hub from '../src/Hub/Hub'
export const model = new Hub()

export const init = () => {
	const root = document.getElementById('hub')
	root.innerHTML = require('../src/Hub/Hub.html')
	ko.applyBindings(model, root)
	window['model'] = model
}
