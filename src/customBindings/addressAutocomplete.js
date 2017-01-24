import * as ko from 'knockout'
import 'jquery-ui/ui/core'
import 'jquery-ui/ui/widgets/autocomplete'



const recursiveFindName = (function letsMagic(tree, filterName) {

	const classOf = obj => Object.prototype.toString.call(obj).slice(8, -1)
	const currIterable = classOf(tree)

	if( currIterable === 'Array' ) {
		if (tree.indexOf(filterName) > -1)
			return true

		for (let i = 0; i < tree.length; i++) {
			if (typeof tree[i] === 'object') {
				if (letsMagic(tree[i], filterName))
					return tree[i].short_name
				letsMagic(tree[i], filterName)
			}
		}
	}

	else if ( currIterable === 'Object' )
		for(let key in tree) {
			if( typeof tree[key] === 'object' )
				return letsMagic(tree[key], filterName)
		}
})


const formattedResponse = (data, filterName, additionalFilter) => {
	const formattedArr = []

	data.map(item => {

		// check on type of item (city/street..)
		if( item.types.indexOf(filterName) < 0 ) return false

		const name = recursiveFindName(item.address_components, filterName)
		const descr = recursiveFindName(item.address_components, additionalFilter)

		if( name ) {
			formattedArr.push({
				label: `${name}${descr ? ' ('+descr+')' : ''}`,
				value: name,
				coordinates: item.geometry.location
			})
		}
	})

	return formattedArr
}

ko.bindingHandlers.cityAutocomplete = {
	init(element, valueAccessor, allBindings, viewModel, bindingContext) {
		const prop = bindingContext.$data

		$(element).autocomplete({
			minLength: 2,
			autoFocus: true,

			source(request, response) {
				prop.geoCoder(`&address=${$(element).val()}`)
					.then(data => response( formattedResponse(data, 'locality', 'administrative_area_level_1') ))
			},

			select(event, ui) {
				const prop = bindingContext.$data
				prop.lat( ui.item.coordinates.lat )
				prop.lng( ui.item.coordinates.lng )
				prop.city( ui.item.value )
				prop.mapZoom(16)
			}
		})
	}
}

ko.bindingHandlers.streetAutocomplete = {
	init(element, valueAccessor, allBindings, viewModel, bindingContext) {
		const prop = bindingContext.$data

		$(element).autocomplete({
			minLength: 3,
			autoFocus: true,

			source(request, response) {
				const addressQuery = `&address=${ prop.city() ? prop.city() : '' } ${ $(element).val()}`

				prop.geoCoder(addressQuery)
					.then(data => response( formattedResponse(data, 'route', 'locality') ))
			},

			select(event, ui) {
				const prop = bindingContext.$data
				prop.lat( ui.item.coordinates.lat )
				prop.lng( ui.item.coordinates.lng )
				prop.street( ui.item.value )
				prop.mapZoom(17)
			}
		})
	}
}
