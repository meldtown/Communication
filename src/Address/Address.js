import * as ko from 'knockout'

export default class Address {
	constructor({id, city, street, building, office, description, mapFile} = {}) {
		this.id = ko.observable(id)
		this.city = ko.observable(city)
		this.street = ko.observable(street)
		this.building = ko.observable(building)
		this.office = ko.observable(office || '')
		this.description = ko.observable(description)
		this.mapFile = ko.observable(mapFile)

		this.optionText = ko.computed(() => {
			return `${this.city()} ${this.street()} ${this.building()}, ${this.office()}`
		})
	}
}
