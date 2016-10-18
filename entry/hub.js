import * as ko from 'knockout'
import * as helpers from '../src/helpers'
import Hub from '../src/Hub/Hub'

export const dispatcher = new ko.subscribable()
export const model = new Hub(dispatcher)

export const init = () => {
	const root = document.getElementById('hub')
	root.innerHTML = require('../src/Hub/Hub.html')
	helpers.injectTemplate('Conversation', require('../src/Conversation/Conversation.html'))
	helpers.injectTemplate('MessageList', require('../src/Message/MessageList.html'))
	// helpers.injectTemplate('MessageListItemInvite', require('../src/Message/MessageListItemInvite.html'))
	// helpers.injectTemplate('MessageListItemDecline', require('../src/Message/MessageListItemDecline.html'))
	// helpers.injectTemplate('MessageListItemResponse', require('../src/Message/MessageListItemResponse.html'))
	model.fetch()
	ko.applyBindings(model, root)
	window['model'] = model
}
