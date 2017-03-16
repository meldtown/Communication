import * as ko from 'knockout'
import * as constants from '../constants'

export default class Address {
	constructor(dispatcher, {id, city, street, building, office, description, mapFile, longitude, latitude, lat, lng} = {}) {
		this.id = ko.observable(id)
		this.city = ko.observable(city)
		this.street = ko.observable(street)
		this.building = ko.observable(building)
		this.office = ko.observable(office || '')
		this.description = ko.observable(description)
		this.mapFile = ko.observable(mapFile)
		this.longitude = ko.observable(longitude ? longitude : lng)
		this.latitude = ko.observable(latitude ? latitude : lat)
		this.mapSrc = ko.computed(() => {
			return `https://maps.googleapis.com/maps/api/staticmap?center=${this.latitude()},${this.longitude()}&markers=color:red%7C${this.latitude()},${this.longitude()}&zoom=16&size=461x80&key=AIzaSyBu7-9v1gFOFrwP4f62DQdDOcPAziS2wOc`
		})

		this.isViewed = ko.observable(false)
		if (dispatcher) {
			dispatcher.subscribe(({id}) => {
				this.isViewed(this.id() === id)
			}, this, constants.ADDRESS_IS_VIEWED)

		}
		this.optionText = ko.computed(() => {
			return this.id() ? `${this.city()} ${this.street()} ${this.building()}, ${this.office()}`
				: 'Не указывать адрес'
		})
	}
}
