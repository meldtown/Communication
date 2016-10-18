import StandardTemplateView from './View/StandardTemplateView'
import InviteTemplateView from './View/InviteTemplateView'
import OfferTemplateView from './View/OfferTemplateView'
import DeclineTemplateView from './View/DeclineTemplateView'
import * as types from '../types'


export default class TemplateFactory {
	static create(data = {}) {
		let {type} = data
		switch (type) {
			case types.STANDARD:
				return new StandardTemplateView(data)
			case types.INVITE:
				return new InviteTemplateView(data)
			case types.DECLINE:
				return new DeclineTemplateView(data)
			case types.OFFER:
				return new OfferTemplateView(data)
			default: return null
		}
	}
}

