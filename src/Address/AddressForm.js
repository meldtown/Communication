import * as ko from 'knockout'
import axios from 'axios'

export default class AddressForm {
	constructor() {
		this.city = ko.observable()
		this.street = ko.observable()
		this.building = ko.observable()
		this.office = ko.observable()
		this.description = ko.observable()
		this.mapFile = ko.observable()
	}

	save() {
		let data = {
			city: this.city(),
			street: this.street(),
			building: this.building(),
			office: this.office(),
			description: this.description(),
		}
		if (!data.city || !data.street || !data.building) return new Promise((res, rej) => rej())
		return axios.post(`${api}/addresses/`, data).then(response => {
			this.id = response.data.id
		})
	}
}
