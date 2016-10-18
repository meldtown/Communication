import * as types from './src/constants'
import faker from 'faker'
import fs from 'fs'

// <editor-fold desc="Constants">
const NUMBER_OF_CONVERSATIONS = 20

const MESSAGE_TYPES = [
	types.STANDARD_MESSAGE,
	types.INVITE_MESSAGE,
	types.DECLINE_MESSAGE,
	types.OFFER_MESSAGE,
	types.APPLY_MESSAGE
]

const CONVERSATION_TYPES = [
	types.ACTIVE_CONVERSATION,
	types.ARCHIVED_CONVERSATION,
	types.BLOCKED_CONVERSATION
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
	type: types.STANDARD_MESSAGE,
	date: generateRecentDate(),
	text: faker.hacker.phrase(),
	avatar: faker.image.avatar(),
	multiUser: generateNumberBetween(0, 1),
	isRead: faker.random.boolean()
})

export const generateInviteMessage = (id, conversationId) => ({
	id,
	conversationId,
	type: types.INVITE_MESSAGE,
	date: generateRecentDate(),
	text: faker.hacker.phrase(),
	inviteDate: generateWorkTime(),
	addressId: generateNumberBetween(1, 50),
	isRead: faker.random.boolean()
})

export const generateDeclineMessage = (id, conversationId) => ({
	id,
	conversationId,
	type: types.DECLINE_MESSAGE,
	date: generateRecentDate(),
	text: faker.hacker.phrase(),
	isRead: faker.random.boolean()
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

export const generateOfferMessage = (id, conversationId, vacancies = []) => {
	let vacancy = vacancies.length > 0 ? faker.random.arrayElement(vacancies) : generateVacancy()
	return {
		id,
		conversationId,
		type: types.OFFER_MESSAGE,
		date: generateRecentDate(),
		text: faker.hacker.phrase(),
		vacancyId: vacancy.id,
		vacancy: vacancy,
		isRead: faker.random.boolean()
	}
}

export const generateApplyMessage = (id, conversationId) => ({
	id,
	conversationId,
	type: types.APPLY_MESSAGE,
	date: generateRecentDate(),
	text: faker.hacker.phrase(),
	avatar: faker.image.avatar(),
	isRead: faker.random.boolean()
})

const generateMessage = (id, conversationId, vacancies) => {
	var type = faker.random.arrayElement(MESSAGE_TYPES)
	switch (type) {
		case types.INVITE_MESSAGE:
			return generateInviteMessage(id, conversationId)
		case types.DECLINE_MESSAGE:
			return generateDeclineMessage(id, conversationId)
		case types.OFFER_MESSAGE:
			return generateOfferMessage(id, conversationId, vacancies)
		case types.APPLY_MESSAGE:
			return generateApplyMessage(id, conversationId)
		default:
			return generateStandardMessage(id, conversationId)
	}
}

export const generateConversation = (id, messages) => {
	let conversationMessages = messages.filter(message => message.conversationId === id)
	let lastMessage = conversationMessages.sort((left, right) => new Date(left.date) - new Date(right.date))[0]
	let unreadMessagesCount = conversationMessages.filter(message => !message.isRead).length

	return {
		id,
		unreadMessagesCount,
		type: faker.random.arrayElement(CONVERSATION_TYPES),
		fullName: faker.name.findName(),
		avatar: faker.image.avatar(),
		lastMessage: lastMessage
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
	const {type, text, inviteDate, addressId } = generateInviteMessage(id, 0)

	return {id, type, text, inviteDate, addressId, title: faker.random.word(), language: generateLanguage()}
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
	let type = faker.random.arrayElement(MESSAGE_TYPES.filter(type => type !== types.APPLY_MESSAGE))
	switch (type) {
		case types.INVITE_MESSAGE:
			return generateInviteTemplate(id)
		case types.DECLINE_MESSAGE:
			return generateDeclineTemplate(id)
		case types.OFFER_MESSAGE:
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
