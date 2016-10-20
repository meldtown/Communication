import * as ko from 'knockout'
import * as helpers from '../src/helpers'
import Accordion from '../src/Accordion/Accordion'

export const dispatcher = new ko.subscribable()

export const init = conversationId => {
	const model = new Accordion(dispatcher, conversationId)
	const root = document.getElementById('accordion')
	root.innerHTML = require('../src/Accordion/Accordion.html')
	helpers.injectTemplate('MessageList', require('../src/Message/MessageList.html'))
	helpers.injectTemplate('Conversation', require('../src/Conversation/Conversation.html'))

	helpers.injectTemplate('StandardMessage', require('../src/Message/StandardMessage.html'))
	helpers.injectTemplate('InviteMessage', require('../src/Message/InviteMessage.html'))
	helpers.injectTemplate('DeclineMessage', require('../src/Message/DeclineMessage.html'))
	helpers.injectTemplate('OfferMessage', require('../src/Message/OfferMessage.html'))
	helpers.injectTemplate('ApplyMessage', require('../src/Message/ApplyMessage.html'))

	helpers.injectTemplate('StandardMessageForm', require('../src/Message/Form/StandardMessageForm.html'))
	helpers.injectTemplate('InviteMessageForm', require('../src/Message/Form/InviteMessageForm.html'))
	helpers.injectTemplate('DeclineMessageForm', require('../src/Message/Form/DeclineMessageForm.html'))
	helpers.injectTemplate('OfferMessageForm', require('../src/Message/Form/OfferMessageForm.html'))

	helpers.injectTemplate('StandardMessagePreview', require('../src/Message/StandardMessagePreview.html'))
	helpers.injectTemplate('InviteMessagePreview', require('../src/Message/InviteMessagePreview.html'))
	helpers.injectTemplate('DeclineMessagePreview', require('../src/Message/DeclineMessagePreview.html'))
	helpers.injectTemplate('OfferMessagePreview', require('../src/Message/OfferMessagePreview.html'))
	helpers.injectTemplate('ApplyMessagePreview', require('../src/Message/ApplyMessagePreview.html'))

	model.fetchConversation()
	model.fetch()
	ko.applyBindings(model, root)
	window['model'] = model
}
