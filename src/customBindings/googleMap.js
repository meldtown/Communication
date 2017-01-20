ko.bindingHandlers.googleMap = {
	init(element, valueAccessor) {
		const prop = valueAccessor()
		let lat = parseFloat(prop.lat()) || 0
		let lng = parseFloat(prop.lng()) || 0

		const map = new google.maps.Map(element, {
			center: {lat, lng},
			zoom: 15
		})

		const marker = new google.maps.Marker({
			position: { lat, lng },
			draggable: true,
			map: map
		})

		marker.addListener('dragend', () => {
			map.panTo(marker.getPosition())
		})

		map.addListener('center_changed', () => {
			let center = map.getCenter()
			marker.setPosition(center)
			prop.lat(center.lat())
			prop.lng(center.lng())
		})

		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(position => {
				map.setCenter({lat: position.coords.latitude, lng: position.coords.longitude});
			})
		}

		element.map = map
	},
	update(element, valueAccessor) {
		let prop = valueAccessor()
		let lat = parseFloat(prop.lat()) || 0
		let lng = parseFloat(prop.lng()) || 0

		element.map.setCenter({lat, lng})
	}
}
