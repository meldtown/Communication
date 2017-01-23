import axios from 'axios'
import * as ko from 'knockout'
import * as helpers from '../src/helpers'
import Templates from '../src/Templates/Templates'

axios.defaults.withCredentials = true


export const dispatcher = new ko.subscribable()
export const model = new Templates(dispatcher)

export const init = () => {
	const root = document.getElementById('templates')
	root.innerHTML = require('../src/Templates/Templates.html')
	helpers.injectTemplate('AbstractTemplateView', require('../src/Templates/View/AbstractTemplateView.html'))
	helpers.injectTemplate('DeclineTemplateView', require('../src/Templates/View/DeclineTemplateView.html'))
	helpers.injectTemplate('InviteTemplateView', require('../src/Templates/View/InviteTemplateView.html'))
	helpers.injectTemplate('OfferTemplateView', require('../src/Templates/View/OfferTemplateView.html'))
	helpers.injectTemplate('StandardTemplateView', require('../src/Templates/View/StandardTemplateView.html'))

	helpers.injectTemplate('AbstractTemplateForm', require('../src/Templates/Form/AbstractTemplateForm.html'))
	helpers.injectTemplate('DeclineTemplateForm', require('../src/Templates/Form/DeclineTemplateForm.html'))
	helpers.injectTemplate('InviteTemplateForm', require('../src/Templates/Form/InviteTemplateForm.html'))
	helpers.injectTemplate('OfferTemplateForm', require('../src/Templates/Form/OfferTemplateForm.html'))
	helpers.injectTemplate('StandardTemplateForm', require('../src/Templates/Form/StandardTemplateForm.html'))

	helpers.injectTemplate('AddressForm', require('../src/Address/AddressForm.html'))

	model.fetch()
	// model.fetchAddresses()
	ko.applyBindings(model, root)
	window['model'] = model
	window['ko'] = ko
}

