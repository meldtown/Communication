import AbstractTemplate from '../AbstractTemplate'

export default class AbstractTemplateForm extends AbstractTemplate {
	constructor(dispatcher, data) {
		super(dispatcher, data)
	}

	fill(selectedTemplate) {
		selectedTemplate.text(this.text())
		selectedTemplate.title(this.title())
		selectedTemplate.id(this.id())
		selectedTemplate.language(this.language())
	}
}
