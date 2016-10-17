import * as messageTypes from './src/Message/types'
import faker from 'faker'
import fs from 'fs'

// <editor-fold desc="Constants">
const NUMBER_OF_CONVERSATIONS = 5

const STANDARD_MESSAGE = messageTypes.STANDARD
const INVITE_MESSAGE = messageTypes.INVITE
const DECLINE_MESSAGE = messageTypes.DECLINE
const OFFER_MESSAGE = messageTypes.OFFER
const RESPONSE_MESSAGE = messageTypes.RESPONSE

const MESSAGE_TYPES = [
	STANDARD_MESSAGE,
	INVITE_MESSAGE,
	DECLINE_MESSAGE,
	OFFER_MESSAGE,
	RESPONSE_MESSAGE
]
// </editor-fold>

// <editor-fold desc="Generators">
const generateNumberBetween = (min, max) => faker.random.number(max - min) + min
const generateWorkTime = () => `${generateNumberBetween(11, 20)}:${faker.random.arrayElement(['00', '30'])}`
const generateDummyImage = (width, height, backgroundColor, color, text) => `https://dummyimage.com/${width}x${height}/${backgroundColor}/${color}.png&text=${text}`
const generateRecentDate = () => faker.date.recent(300)

const generateStandardMessage = (id, conversationId) => ({
	id,
	conversationId,
	type: STANDARD_MESSAGE,
	date: generateRecentDate(),
	text: faker.hacker.phrase()
})

const generateInviteMessage = (id, conversationId) => ({
	id,
	conversationId,
	type: INVITE_MESSAGE,
	date: generateRecentDate(),
	text: faker.hacker.phrase(),
	time: generateWorkTime(),
	address: faker.address.streetAddress(),
	phone: faker.phone.phoneNumber()
})

const generateDeclineMessage = (id, conversationId) => ({
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

const generateSuggestMessage = (id, conversationId) => ({
	id,
	conversationId,
	type: OFFER_MESSAGE,
	date: generateRecentDate(),
	text: faker.hacker.phrase(),
	vacancy: generateVacancy()
})

const generateResponseMessage = (id, conversationId) => ({
	id,
	conversationId,
	type: RESPONSE_MESSAGE,
	date: generateRecentDate(),
	text: faker.hacker.phrase(),
	avatar: faker.image.avatar()
})

const generateMessage = (id, conversationId) => {
	var type = faker.random.arrayElement(MESSAGE_TYPES)
	switch (type) {
		case INVITE_MESSAGE:
			return generateInviteMessage(id, conversationId)
		case DECLINE_MESSAGE:
			return generateDeclineMessage(id, conversationId)
		case OFFER_MESSAGE:
			return generateSuggestMessage(id, conversationId)
		case RESPONSE_MESSAGE:
			return generateResponseMessage(id, conversationId)
		default:
			return generateStandardMessage(id, conversationId)
	}
}

const generateConversation = (id, messages) => {
	let lastMessage = messages
		.filter(message => message.conversationId === id)
		.sort((left, right) => new Date(left.date) - new Date(right.date))[0]

	return {
		id,
		fullName: faker.name.findName(),
		date: lastMessage.date,
		message: lastMessage
	}
}

const generateMessages = () => {
	let messageId = 1
	let messages = []
	for (let conversationId = 1; conversationId <= NUMBER_OF_CONVERSATIONS; conversationId++) {
		let numberOfMessages = generateNumberBetween(1, 10)
		for (let id = 1; id <= numberOfMessages; id++) {
			messages.push(generateMessage(messageId++, conversationId))
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
// </editor-fold>

if (require.main === module) {
	let messages = generateMessages()
	let conversations = generateConversations(messages)

	let db = {
		conversations,
		messages
	}

	let json = JSON.stringify(db, null, 4)

	fs.writeFileSync('db.json', json)

	console.log(json) // eslint-disable-line no-console
}
