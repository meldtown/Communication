import * as ko from 'knockout'

export default class Address {
	constructor({id, city, street, building, office, description, mapFile, longitude, latitude} = {}) {
		this.id = ko.observable(id)
		this.city = ko.observable(city)
		this.street = ko.observable(street)
		this.building = ko.observable(building)
		this.office = ko.observable(office || '')
		this.description = ko.observable(description)
		this.mapFile = ko.observable(mapFile)
		this.longitude = ko.observable(longitude)
		this.latitude = ko.observable(latitude)
		this.mapSrc = ko.computed(() => {
			return `https://maps.googleapis.com/maps/api/staticmap?center=${this.latitude()},${this.longitude()}&markers=color:red%7C${this.latitude()},${this.longitude()}&zoom=16&size=461x80&key=AIzaSyBu7-9v1gFOFrwP4f62DQdDOcPAziS2wOc`
		})

		this.optionText = ko.computed(() => {
			return `${this.city()} ${this.street()} ${this.building()}, ${this.office()}`
		})
	}
}
