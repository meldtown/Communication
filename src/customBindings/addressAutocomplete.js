import * as ko from 'knockout'
import 'jquery-ui/ui/core'
import 'jquery-ui/ui/widgets/autocomplete'
import axios from 'axios'

ko.bindingHandlers.cityAutocomplete = {
	init(element, valueAccessor, allBindings, viewModel, bindingContext) {
		const googleApi = 'https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyC7Tu5aFWFlg845_hG_fw70JmN81mlrh1Q'

		$(element).autocomplete({
			minLength: 2,
			autoFocus: true,

			source(request, response) {
				axios.get(`${googleApi}&types=regions&address=Украина, ${ $(element).val() }`, { withCredentials: false })
					.then(res => {
						if( res.data.status !== 'OK' ) return false

						const citiesArr = res.data.results.map(city => {
							return {
								label: city.formatted_address,
								coordinates: city.geometry.location
							}
						})
						response(citiesArr)
					})
			},

			select(event, ui) {
				const prop = bindingContext.$data
				prop.lat( ui.item.coordinates.lat )
				prop.lng( ui.item.coordinates.lng )
				prop.lat( ui.item.coordinates.lat )
				prop.city( ui.item.label )
			}
		})
	}
}
