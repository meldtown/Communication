import * as ko from 'knockout'
import axios from 'axios'

export default class AddressForm {
	constructor() {
		this.city = ko.observable('')
		this.street = ko.observable('')
		this.building = ko.observable('')
		this.office = ko.observable('')
		this.mapFile = ko.observable('')
		this.lat = ko.observable(50.466040)
		this.lng = ko.observable(30.512890)
		this.mapZoom = ko.observable(15)
		this.description = ko.observable('')
	}

	geoCoder(queryString) {
		const googleApi = 'https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyC7Tu5aFWFlg845_hG_fw70JmN81mlrh1Q'

		const searchAddress = axios.get(`${googleApi}&components=country:Ukraine&address=${queryString}`, { withCredentials: false })
			.then(res => {
				if( res.data.status !== 'OK' ) return Promise.reject('Address Not Found')
				return Promise.resolve(res.data.results)
			})

		return searchAddress
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
