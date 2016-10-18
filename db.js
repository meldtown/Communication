import * as messageTypes from './src/types'
import faker from 'faker'
import fs from 'fs'

// <editor-fold desc="Constants">
const NUMBER_OF_CONVERSATIONS = 5

const STANDARD_MESSAGE = messageTypes.STANDARD
const INVITE_MESSAGE = messageTypes.INVITE
const DECLINE_MESSAGE = messageTypes.DECLINE
const OFFER_MESSAGE = messageTypes.OFFER
const APPLY_MESSAGE = messageTypes.APPLY

const MESSAGE_TYPES = [
	STANDARD_MESSAGE,
	INVITE_MESSAGE,
	DECLINE_MESSAGE,
	OFFER_MESSAGE,
	APPLY_MESSAGE
]
// </editor-fold>

// <editor-fold desc="Generators">
const generateNumberBetween = (min, max) => faker.random.number(max - min) + min
const generateWorkTime = () => `${generateNumberBetween(11, 20)}:${faker.random.arrayElement(['00', '30'])}`
const generateDummyImage = (width, height, backgroundColor, color, text) => `https://dummyimage.com/${width}x${height}/${backgroundColor}/${color}.png&text=${text}`
const generateRecentDate = () => faker.date.recent(300).toISOString()
const generateLanguage = () => faker.random.arrayElement(['ru', 'en', 'ua'])

export const generateStandardMessage = (id, conversationId) => ({
	id,
	conversationId,
	type: STANDARD_MESSAGE,
	date: generateRecentDate(),
	text: faker.hacker.phrase()
})

export const generateInviteMessage = (id, conversationId) => ({
	id,
	conversationId,
	type: INVITE_MESSAGE,
	date: generateRecentDate(),
	text: faker.hacker.phrase(),
	inviteDate: generateWorkTime(),
	addressId: generateNumberBetween(1, 50)
})

export const generateDeclineMessage = (id, conversationId) => ({
	id,
	conversationId,
	type: DECLINE_MESSAGE,
	date: generateRecentDate(),
	text: faker.hacker.phrase()
})

const generateVacancy = () => {
	let companyName = faker.company.companyName()
	let color = faker.internet.color(255, 255, 255)
	return {
		companyName,
		vacancyName: faker.name.jobTitle(),
		salary: faker.random.arrayElement([null, 1000, 5000, 10000]),
		city: faker.address.city(),
		description: faker.lorem.paragraph(),
		vacancyId: generateNumberBetween(10000, 20000),
		companyId: generateNumberBetween(10000, 20000),
		logoUrl: generateDummyImage(92, 55, color.substr(1), 'ffffff', companyName.match(/[A-ZА-Я]/g).join(''))
	}
}

export const generateOfferMessage = (id, conversationId, vacancies = []) => ({
	id,
	conversationId,
	type: OFFER_MESSAGE,
	date: generateRecentDate(),
	text: faker.hacker.phrase(),
	vacancy: vacancies.length > 0 ? faker.random.arrayElement(vacancies) : generateVacancy()
})

export const generateApplyMessage = (id, conversationId) => ({
	id,
	conversationId,
	type: APPLY_MESSAGE,
	date: generateRecentDate(),
	text: faker.hacker.phrase(),
	avatar: faker.image.avatar()
})

const generateMessage = (id, conversationId, vacancies) => {
	var type = faker.random.arrayElement(MESSAGE_TYPES)
	switch (type) {
		case INVITE_MESSAGE:
			return generateInviteMessage(id, conversationId)
		case DECLINE_MESSAGE:
			return generateDeclineMessage(id, conversationId)
		case OFFER_MESSAGE:
			return generateOfferMessage(id, conversationId, vacancies)
		case APPLY_MESSAGE:
			return generateApplyMessage(id, conversationId)
		default:
			return generateStandardMessage(id, conversationId)
	}
}

export const generateConversation = (id, messages) => {
	let lastMessage = messages
		.filter(message => message.conversationId === id)
		.sort((left, right) => new Date(left.date) - new Date(right.date))[0]

	return {
		id,
		fullName: faker.name.findName(),
		message: lastMessage
	}
}

const generateMessages = vacancies => {
	let messageId = 1
	let messages = []
	for (let conversationId = 1; conversationId <= NUMBER_OF_CONVERSATIONS; conversationId++) {
		let numberOfMessages = generateNumberBetween(1, 10)
		for (let id = 1; id <= numberOfMessages; id++) {
			messages.push(generateMessage(messageId++, conversationId, vacancies))
		}
	}
	return messages
}

const generateConversations = messages => {
	let conversations = []
	for (let id = 1; id <= NUMBER_OF_CONVERSATIONS; id++) {
		conversations.push(generateConversation(id, messages))
	}
	return conversations
}

export const generateStandardTemplate = id => {
	const {type, text} = generateStandardMessage(id, 0)

	return {id, type, text, title: faker.random.word(), language: generateLanguage()}
}

export const generateInviteTemplate = id => {
	const {type, text, time, address } = generateInviteMessage(id, 0)

	return {id, type, text, time, address, title: faker.random.word(), language: generateLanguage()}
}

export const generateDeclineTemplate = id => {
	const {type, text} = generateDeclineMessage(id, 0)
	return {id, type, text, title: faker.random.word(), language: generateLanguage()}
}

export const generateOfferTemplate = id => {
	const {type, text} = generateOfferMessage(id, 0)

	return {id, type, text, title: faker.random.word(), language: generateLanguage()}
}

const generateTemplate = id => {
	let type = faker.random.arrayElement(MESSAGE_TYPES.filter(type => type !== APPLY_MESSAGE))
	switch (type) {
		case INVITE_MESSAGE:
			return generateInviteTemplate(id)
		case DECLINE_MESSAGE:
			return generateDeclineTemplate(id)
		case OFFER_MESSAGE:
			return generateOfferTemplate(id)
		default:
			return generateStandardTemplate(id)
	}
}

const generateTemplates = () => {
	let templates = []
	let numberOfTemplates = generateNumberBetween(3, 10)

	for (let id = 1; id <= numberOfTemplates; id++) {
		templates.push(generateTemplate(id))
	}

	return templates
}

const generateVacancies = () => {
	let vacancies = []
	let numberOfVacancies = generateNumberBetween(3, 10)

	for (let id = 1; id <= numberOfVacancies; id++) {
		vacancies.push(generateVacancy(id))
	}

	return vacancies
}
// </editor-fold>

if (require.main === module) {
	let vacancies = generateVacancies()
	let messages = generateMessages(vacancies)
	let conversations = generateConversations(messages)
	let templates = generateTemplates()

	let db = {
		vacancies,
		conversations,
		messages,
		templates
	}

	let json = JSON.stringify(db, null, 4)

	fs.writeFileSync('db.json', json)

	console.log(json) // eslint-disable-line no-console
}
