import * as ko from 'knockout'
import * as helpers from '../src/helpers'
import Hub from '../src/Hub/Hub'
export const model = new Hub()

export const init = () => {
	const root = document.getElementById('hub')
	root.innerHTML = require('../src/Hub/Hub.html')
	helpers.injectTemplate('ConversationSidebarPreview', require('../src/Conversation/ConversationSidebarPreview.html'))
	helpers.injectTemplate('MessageList', require('../src/MessageList/MessageList.html'))

	ko.applyBindings(model, root)
	window['model'] = model
}
