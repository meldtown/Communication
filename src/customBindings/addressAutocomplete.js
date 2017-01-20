import * as ko from 'knockout'
import 'jquery-ui/ui/core'
import 'jquery-ui/ui/widgets/autocomplete'



const recursiveTree = (function letsMagic(tree) {
	console.debug('Tree: ', tree)

	const classOf = obj => {
		return Object.prototype.toString.call(obj).slice(8, -1)
	}

	if(classOf(tree) === 'Object') {
		Object.keys(tree).map(item => {
			if(typeof tree[item] === 'object') {
				letsMagic(tree[item])
			}
		})
	}

	else if (classOf(tree) === 'Array') {

		console.log('ARRAY_TREE', tree)
		if( tree.indexOf('locality') !== -1 ) {
			console.log('Im Find: ', tree.indexOf('locality'))
		}

		tree.map(item => {
			if(typeof item === 'object') {
				letsMagic(item)
			}
		})
	}

	else
		return false
})


const formattedResponse = (data, filterName) => {
	// return data.filter(item => {
    //
	// 	const name = item.address_components.filter(comp => {
	// 		return comp.types.indexOf('locality') !== -1
	// 	})
    //
	// 	if( name.length === 0 ) return false
    //
	// 	return {
	// 		label: (name[0].long_name || item.formatted_address),
	// 		coordinates: item.geometry.location
	// 	}
	// })

	data.map(item => {
		recursiveTree(item.address_components)
	})
}

ko.bindingHandlers.cityAutocomplete = {
	init(element, valueAccessor, allBindings, viewModel, bindingContext) {
		const prop = bindingContext.$data

		$(element).autocomplete({
			minLength: 2,
			autoFocus: true,

			source(request, response) {
				prop.geoCoder(`${$(element).val()}`)
					.then(data => response( formattedResponse(data) ))
			},

			select(event, ui) {
				const prop = bindingContext.$data
				prop.lat( ui.item.coordinates.lat )
				prop.lng( ui.item.coordinates.lng )
				prop.city( ui.item.label )
			}
		})
	}
}

ko.bindingHandlers.streetAutocomplete = {
	init(element, valueAccessor, allBindings, viewModel, bindingContext) {
		const prop = bindingContext.$data

		$(element).autocomplete({
			minLength: 5,
			autoFocus: false,

			source(request, response) {
				prop.geoCoder(`${prop.city()} ${$(element).val()}`)
					.then(data => response( formattedResponse(data) ))
			},

			select(event, ui) {
				const prop = bindingContext.$data
				prop.lat( ui.item.coordinates.lat )
				prop.lng( ui.item.coordinates.lng )
				prop.street( ui.item.label )
			}
		})
	}
}
