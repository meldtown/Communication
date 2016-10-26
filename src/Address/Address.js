import * as ko from 'knockout'

export default class Address {
	constructor({id, city, street, houseNumber, office, description, mapFile} = {}) {
		this.id = ko.observable(id)
		this.city = ko.observable(city)
		this.street = ko.observable(street)
		this.houseNumber = ko.observable(houseNumber)
		this.office = ko.observable(office)
		this.description = ko.observable(description)
		this.mapFile = ko.observable(mapFile)

		this.optionText = ko.computed(() => `${this.street()} ${this.houseNumber()}, ${this.office()}`)
	}
}
