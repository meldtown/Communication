import StandardTemplateView from './View/StandardTemplateView'
import InviteTemplateView from './View/InviteTemplateView'
import OfferTemplateView from './View/OfferTemplateView'
import DeclineTemplateView from './View/DeclineTemplateView'
import * as types from '../constants'


export default class TemplateFactory {
	static create(data = {}) {
		let {type} = data
		switch (type) {
			case types.STANDARD_MESSAGE:
				return new StandardTemplateView(data)
			case types.INVITE_MESSAGE:
				return new InviteTemplateView(data)
			case types.DECLINE_MESSAGE:
				return new DeclineTemplateView(data)
			case types.OFFER_MESSAGE:
				return new OfferTemplateView(data)
			default: return null
		}
	}
}

