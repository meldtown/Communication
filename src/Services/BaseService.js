import * as ko from 'knockout'

export default class BaseService {
	constructor(dispatcher, api) {
		if (!ko.isSubscribable(dispatcher)) {
			throw new Error('ko.subscribable is required')
		}


		if (!api) {
			throw new Error('api is required')
		}

		this.dispatcher = dispatcher
		this.api = api
	}
}
