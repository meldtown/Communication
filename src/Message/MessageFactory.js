import * as types from '../constants'
import StandardMessage from './StandardMessage'
import InviteMessage from './InviteMessage'
import DeclineMessage from './DeclineMessage'
import OfferMessage from './OfferMessage'
import ApplyMessage from './ApplyMessage'

export default class MessageFactory {
	static create(data = {}) {
		let {typeId} = data // var type = data.type
		switch (typeId) {
			case types.STANDARD_MESSAGE:
				return new StandardMessage(data)
			case types.INVITE_MESSAGE:
				return new InviteMessage(data)
			case types.DECLINE_MESSAGE:
				return new DeclineMessage(data)
			case types.OFFER_MESSAGE:
				return new OfferMessage(data)
			case types.APPLY_MESSAGE:
				return new ApplyMessage(data)
			default:
				return null
		}
	}
}
