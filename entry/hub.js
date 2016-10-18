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

	helpers.injectTemplate('StandardMessage', require('../src/Message/StandardMessage.html'))
	helpers.injectTemplate('InviteMessage', require('../src/Message/InviteMessage.html'))
	helpers.injectTemplate('DeclineMessage', require('../src/Message/DeclineMessage.html'))
	helpers.injectTemplate('OfferMessage', require('../src/Message/OfferMessage.html'))
	helpers.injectTemplate('ApplyMessage', require('../src/Message/ApplyMessage.html'))

	helpers.injectTemplate('StandardMessageForm', require('../src/Message/Form/StandardMessageForm.html'))
	helpers.injectTemplate('InviteMessageForm', require('../src/Message/Form/InviteMessageForm.html'))
	helpers.injectTemplate('DeclineMessageForm', require('../src/Message/Form/DeclineMessageForm.html'))
	helpers.injectTemplate('OfferMessageForm', require('../src/Message/Form/OfferMessageForm.html'))

	model.fetch()
	ko.applyBindings(model, root)
	window['model'] = model
}
