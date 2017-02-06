import * as ko from 'knockout'
import perfectScroll from 'perfect-scrollbar'
import './perfectScroll.min.css'


ko.bindingHandlers.perfectScroll = {
	init(element) {
		perfectScroll.initialize(element)
	},
	update(element) {
		perfectScroll.update(element)
	}
}
