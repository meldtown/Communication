import AbstractTemplate from '../AbstractTemplate'

export default class AbstractTemplateForm extends AbstractTemplate {
	constructor(dispatcher, data) {
		super(dispatcher, data)
	}

	fill(selectedTemplate) {
		selectedTemplate.text(this.text())
		selectedTemplate.name(this.name())
		selectedTemplate.id(this.id())
		selectedTemplate.language(this.language())
		selectedTemplate.attach(this.attach())
	}
}
