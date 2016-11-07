import * as types from './src/constants'
import * as helpers from './src/helpers'
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
// </editor-fold>

// <editor-fold desc="Generators">
const generateNumberBetween = (min, max) => faker.random.number(max - min) + min
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

export const generateInviteMessage = (id, conversationId, addresses = []) => {
	let address = addresses && addresses.length > 0 ? faker.random.arrayElement(addresses) : generateAddress(id)
	return {
		id,
		conversationId,
		type: types.INVITE_MESSAGE,
		date: generateRecentDate(),
		text: faker.hacker.phrase(),
		inviteDate: faker.date.future().toISOString(),
		address: address,
		addressId: address.id,
		isRead: faker.random.boolean()
	}
}

export const generateDeclineMessage = (id, conversationId) => ({
	id,
	conversationId,
	type: types.DECLINE_MESSAGE,
	date: generateRecentDate(),
	text: faker.hacker.phrase(),
	isRead: faker.random.boolean()
})

export const generateVacancy = () => {
	let companyName = faker.company.companyName()
	let color = faker.internet.color(255, 255, 255)
	return {
		id: generateNumberBetween(1000, 2000),
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

export const generateApplyMessage = (id, conversationId, vacancies = []) => {
	let vacancy = vacancies.length > 0 ? faker.random.arrayElement(vacancies) : generateVacancy()
	return {
		id,
		conversationId,
		type: types.APPLY_MESSAGE,
		date: generateRecentDate(),
		text: faker.hacker.phrase(),
		avatar: faker.image.avatar(),
		isRead: faker.random.boolean(),
		resumeId: generateNumberBetween(1, 3),
		vacancyId: vacancy.id,
		vacancy: vacancy
	}
}

const generateMessage = (id, conversationId, vacancies, addresses) => {
	var type = faker.random.arrayElement(MESSAGE_TYPES)
	switch (type) {
		case types.INVITE_MESSAGE:
			return generateInviteMessage(id, conversationId, addresses)
		case types.DECLINE_MESSAGE:
			return generateDeclineMessage(id, conversationId)
		case types.OFFER_MESSAGE:
			return generateOfferMessage(id, conversationId, vacancies)
		case types.APPLY_MESSAGE:
			return generateApplyMessage(id, conversationId, vacancies)
		default:
			return generateStandardMessage(id, conversationId)
	}
}

export const generateConversation = (id, messages) => {
	let conversationMessages = messages.filter(message => message.conversationId === id)
	let lastMessage = conversationMessages.sort((left, right) => new Date(left.date) - new Date(right.date))[0]
	let unreadMessagesCount = conversationMessages.filter(message => !message.isRead).length
	let fromCvdb = faker.random.boolean()
	let vacancies = conversationMessages
		.filter(m => m.type === types.APPLY_MESSAGE)
		.map(m => m.vacancyId)
		.reduce(helpers.uniqueReducer, [])
		.map(id => conversationMessages.filter(m => m.type === types.APPLY_MESSAGE && m.vacancyId === id)[0].vacancy)


	return {
		id,
		unreadMessagesCount,
		type: faker.random.arrayElement(types.CONVERSATION_TYPES),
		fullName: faker.name.findName(),
		avatar: faker.image.avatar(),
		lastMessage: lastMessage,
		hasInvites: conversationMessages.some(m => m.type === types.INVITE_MESSAGE),
		hasDeclines: conversationMessages.some(m => m.type === types.DECLINE_MESSAGE),
		hasOffers: conversationMessages.some(m => m.type === types.OFFER_MESSAGE),
		fromCvdb: fromCvdb,
		fromApply: !fromCvdb,
		vacancies
	}
}

const generateMessages = (vacancies, addresses) => {
	let messageId = 1
	let messages = []
	for (let conversationId = 1; conversationId <= NUMBER_OF_CONVERSATIONS; conversationId++) {
		let numberOfMessages = generateNumberBetween(1, 10)
		for (let id = 1; id <= numberOfMessages; id++) {
			messages.push(generateMessage(messageId++, conversationId, vacancies, addresses))
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

export const generateInviteTemplate = (id, addresses = []) => {
	const {type, text, inviteDate, address, addressId } = generateInviteMessage(id, 0, addresses)
	return {id, type, text, inviteDate, addressId, address, title: faker.random.word(), language: generateLanguage()}
}

export const generateDeclineTemplate = id => {
	const {type, text} = generateDeclineMessage(id, 0)
	return {id, type, text, title: faker.random.word(), language: generateLanguage()}
}

export const generateOfferTemplate = id => {
	const {type, text} = generateOfferMessage(id, 0)

	return {id, type, text, title: faker.random.word(), language: generateLanguage()}
}

const generateTemplate = (id, addresses) => {
	let type = faker.random.arrayElement(MESSAGE_TYPES.filter(type => type !== types.APPLY_MESSAGE))
	switch (type) {
		case types.INVITE_MESSAGE:
			return generateInviteTemplate(id, addresses)
		case types.DECLINE_MESSAGE:
			return generateDeclineTemplate(id)
		case types.OFFER_MESSAGE:
			return generateOfferTemplate(id)
		default:
			return generateStandardTemplate(id)
	}
}

const generateTemplates = addresses => {
	let templates = []
	let numberOfTemplates = generateNumberBetween(3, 10)

	for (let id = 1; id <= numberOfTemplates; id++) {
		templates.push(generateTemplate(id, addresses))
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

export const generateAddress = id => ({
	id,
	city: faker.address.city(),
	street: faker.address.streetName(),
	houseNumber: faker.address.streetAddress(),
	office: generateNumberBetween(1, 10),
	description: faker.hacker.phrase(),
	mapFile: `https://static-maps.yandex.ru/1.x/?l=map&ll=${faker.address.longitude()},${faker.address.latitude()}`
})

const generateAddresses = () => {
	let addresses = []
	let numberOfAddresses = generateNumberBetween(2, 10)

	for (let id = 1; id <= numberOfAddresses; id++) {
		addresses.push(generateAddress(id))
	}

	return addresses
}
// </editor-fold>

if (require.main === module) {
	let addresses = generateAddresses()
	let vacancies = generateVacancies()
	let messages = generateMessages(vacancies, addresses)
	let conversations = generateConversations(messages)
	let templates = generateTemplates(addresses)

	let db = {
		vacancies,
		conversations,
		messages,
		templates,
		addresses
	}

	let json = JSON.stringify(db, null, 4)

	fs.writeFileSync('db.json', json)

	console.log(json) // eslint-disable-line no-console
}
