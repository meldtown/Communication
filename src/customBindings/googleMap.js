import * as ko from 'knockout'

ko.bindingHandlers.googleMap = {
	init(element, valueAccessor, allBindings, viewModel, bindingContext) {
		const prop = bindingContext.$data
		let lat = parseFloat(prop.lat()) || 0
		let lng = parseFloat(prop.lng()) || 0

		const map = new google.maps.Map(element, {
			center: {lat, lng},
			zoom: prop.mapZoom()
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

		map.addListener('zoom_changed', () => {
			prop.mapZoom( map.getZoom() )
		})

		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(position => {
				map.setCenter({lat: position.coords.latitude, lng: position.coords.longitude})
			})
		}

		element.map = map
	},
	update(element, valueAccessor, allBindings, viewModel, bindingContext) {
		let prop = bindingContext.$data
		let lat = parseFloat(prop.lat()) || 0
		let lng = parseFloat(prop.lng()) || 0
		element.map.setCenter({lat, lng})
		setTimeout(() => { element.map.setZoom(prop.mapZoom()) }, 100)
	}
}

ko.bindingHandlers.map = {
	init(element, valueAccessor) {
		const prop = valueAccessor()
		let lat = parseFloat(prop.lat()) || 0
		let lng = parseFloat(prop.lng()) || 0
		let zoom = prop.zoom || 14
		let editable = prop.editable || false

		const map = new google.maps.Map(element, {
			center: {lat, lng},
			zoom: zoom
		})

		const marker = new google.maps.Marker({
			position: { lat, lng },
			draggable: editable,
			map: map
		})

		if(editable) {
			marker.addListener('dragend', () => {
				map.panTo(marker.getPosition())
			})

			map.addListener('center_changed', () => {
				let center = map.getCenter()
				marker.setPosition(center)
				prop.lat(center.lat())
				prop.lng(center.lng())
			})

			// map.addListener('zoom_changed', () => {
			// 	prop.mapZoom( map.getZoom() )
			// })

			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(position => {
					map.setCenter({lat: position.coords.latitude, lng: position.coords.longitude})
				})
			}
		}

		element.map = map
	},
	update(element, valueAccessor) {
		const prop = valueAccessor()
		let lat = parseFloat(prop.lat()) || 0
		let lng = parseFloat(prop.lng()) || 0

		element.map.setCenter({lat, lng})
		// setTimeout(() => { element.map.setZoom(prop.mapZoom()) }, 100)
	}
}
