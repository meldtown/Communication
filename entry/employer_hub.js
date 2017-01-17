import axios from 'axios'
import * as ko from 'knockout'
import * as helpers from '../src/helpers'
import EmployerHub from '../src/Hub/EmployerHub'

axios.defaults.withCredentials = true

// noinspection JSPotentiallyInvalidConstructorUsage
export const dispatcher = new ko.subscribable()
export const model = new EmployerHub(dispatcher)

export const init = () => {
	const root = document.getElementById('employer_hub')
	root.innerHTML = require('../src/Hub/EmployerHub.html')
	helpers.injectTemplate('Conversation', require('../src/Conversation/Conversation.html'))
	helpers.injectTemplate('ConversationSelectable', require('../src/Conversation/ConversationSelectable.html'))
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

	helpers.injectTemplate('StandardMessagePreview', require('../src/Message/StandardMessagePreview.html'))
	helpers.injectTemplate('InviteMessagePreview', require('../src/Message/InviteMessagePreview.html'))
	helpers.injectTemplate('DeclineMessagePreview', require('../src/Message/DeclineMessagePreview.html'))
	helpers.injectTemplate('OfferMessagePreview', require('../src/Message/OfferMessagePreview.html'))
	helpers.injectTemplate('ApplyMessagePreview', require('../src/Message/ApplyMessagePreview.html'))
	helpers.injectTemplate('AddressForm', require('../src/Address/AddressForm.html'))

	model.fetch()
	model.offerMessageForm.fetchVacancies()
	model.inviteMessageForm.fetchAddresses()
	ko.applyBindings(model, root)
	window['model'] = model
	window['ko'] = ko
}
