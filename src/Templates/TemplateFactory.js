import StandardTemplateView from './View/StandardTemplateView'
import InviteTemplateView from './View/InviteTemplateView'
import OfferTemplateView from './View/OfferTemplateView'
import DeclineTemplateView from './View/DeclineTemplateView'
import * as types from '../constants'
import * as ko from 'knockout'


export default class TemplateFactory {
	static create(dispatcher, data = {}) {
		if (!ko.isSubscribable(dispatcher)) {
			throw new Error('ko.subscribable is required')
		}

		let {type} = data
		switch (type) {
			case types.STANDARD_MESSAGE:
				return new StandardTemplateView(dispatcher, data)
			case types.INVITE_MESSAGE:
				return new InviteTemplateView(dispatcher, data)
			case types.DECLINE_MESSAGE:
				return new DeclineTemplateView(dispatcher, data)
			case types.OFFER_MESSAGE:
				return new OfferTemplateView(dispatcher, data)
			default: return null
		}
	}
}

