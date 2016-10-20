import * as constants from '../constants'
import axios from 'axios'
import Conversation from '../Conversation/Conversation'
import BaseService from './BaseService'

export default class ConversationService extends BaseService {
	fetch(data) {
		return !data || constants.CONVERSATION_TYPES.indexOf(data) !== -1
			? this._fetchByType(data)
			: this._fetchById(data)
	}

	archive(conversationId) {
		return this._changeType(conversationId, constants.ARCHIVED_CONVERSATION)
	}

	block(conversationId) {
		return this._changeType(conversationId, constants.BLOCKED_CONVERSATION)
	}

	activate(conversationId) {
		return this._changeType(conversationId, constants.ACTIVE_CONVERSATION)
	}

	_changeType(conversationId, type) {
		if (!conversationId) {
			throw new Error('conversationId is required')
		}

		return axios.put(`${this.api}/conversations/${conversationId}`, {body: {type}})
	}

	_fetchByType(type = constants.ACTIVE_CONVERSATION) {
		return axios.get(`${this.api}/conversations`, {params: {type}})
			.then(response => response.data)
			.then(data => data.map(item => new Conversation(this.dispatcher, item)))
	}

	_fetchById(conversationId) {
		return axios.get(`${this.api}/conversations/${conversationId}`)
			.then(response => response.data)
			.then(data => new Conversation(this.dispatcher, data))
	}
}
