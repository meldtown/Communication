import * as types from './types'
import StandardMessage from './StandardMessage'
import InviteMessage from './InviteMessage'
import DeclineMessage from './DeclineMessage'
import OfferMessage from './OfferMessage'

export default class MessageFactory {
	static create(data = {}) {
		let {type} = data
		switch (type) {
			case types.STANDARD:
				return new StandardMessage(data)
			case types.INVITE:
				return new InviteMessage(data)
			case types.DECLINE:
				return new DeclineMessage(data)
			case types.OFFER:
				return new OfferMessage(data)
			default:
				return null
		}
	}
}
