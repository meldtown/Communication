import * as ko from 'knockout'
import * as helpers from '../src/helpers'
import Hub from '../src/Hub/Hub'
export const model = new Hub()

export const init = () => {
	const root = document.getElementById('hub')
	root.innerHTML = require('../src/Hub/Hub.html')
	// helpers.injectTemplate('ConversationSidebarPreview', require('../src/Conversation/ConversationSidebarPreview.html'))
	// helpers.injectTemplate('MessageList', require('../src/Message/MessageList.html'))
	// helpers.injectTemplate('MessageListItemStandard', require('../src/Message/MessageListItemStandard.html'))
	// helpers.injectTemplate('MessageListItemInvite', require('../src/Message/MessageListItemInvite.html'))
	// helpers.injectTemplate('MessageListItemDecline', require('../src/Message/MessageListItemDecline.html'))
	// helpers.injectTemplate('MessageListItemResponse', require('../src/Message/MessageListItemResponse.html'))

	ko.applyBindings(model, root)
	window['model'] = model
}
