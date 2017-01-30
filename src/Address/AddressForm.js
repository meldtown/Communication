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
		this.mapZoom = ko.observable(14)
		this.description = ko.observable('')

		this.building.subscribe(() => {
			const city = this.city() ? this.city() : ''
			const street = this.street() ? this.street() : ''
			const building = this.building() ? this.building() : ''

			const addressQuery = `&address=${city} ${street} ${building}`

			this.geoCoder(addressQuery)
				.then(find => {
					if( find.length > 0 ) {

						if( find[0].types.indexOf('street_address') > -1 ||
							find[0].types.indexOf('premise') > -1 )
						{
							this.lat(find[0].geometry.location.lat)
							this.lng(find[0].geometry.location.lng)
							this.mapZoom(18)
						}

					}
				})
		})
	}

	geoCoder(queryString) {
		const googleApi = 'https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyC7Tu5aFWFlg845_hG_fw70JmN81mlrh1Q'

		return axios.get(`${googleApi}&language=ru&components=country:UA${queryString}`, { withCredentials: false })
			.then(res => {
				if( res.data.status !== 'OK' ) return Promise.reject('Address Not Found')
				return Promise.resolve(res.data.results)
			})
	}

	save() {
		let data = {
			city: this.city(),
			street: this.street(),
			building: this.building(),
			office: this.office(),
			longitude: this.lng(),
			latitude: this.lat(),
			description: this.description(),
			hasMap: true
		}
		if (!data.city || !data.street || !data.building) return Promise.reject(new Error('Some field is empty !!!'))
		return axios.post(`${api2}/employer/address/`, data).then(response => {
			this.id = response.data
		})
	}
}
