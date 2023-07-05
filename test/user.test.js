import supertest from "supertest";
import { web } from "../src/application/web.js";
import { prismaClient } from "../src/application/database.js";
import { logger } from "../src/application/logging.js";

describe('POST /api/users', function () {

	afterEach(async () => {
		await prismaClient.user.deleteMany({
			where: {
				username: "hafiz"
			}
		})
	})

	it('Should can register new user', async () => {
		const result = await supertest(web)
			.post('/api/users')
			.send({
				username: 'hafiz',
				password: 'rahasia',
				name: 'Muhammad Hafiz'
			});

		expect(result.status).toBe(200);
		expect(result.body.data.username).toBe("hafiz");
		expect(result.body.data.name).toBe("Muhammad Hafiz");
		expect(result.body.data.password).toBeUndefined();
	});

	it('Should reject if request is invalid', async () => {
		const result = await supertest(web)
			.post('/api/users')
			.send({
				username: '',
				password: '',
				name: ''
			});

		logger.info(result.body);

		expect(result.status).toBe(400);
		expect(result.body.errors).toBeDefined()
	})

	it('Should reject if username already registered', async () => {
		let result = await supertest(web)
			.post('/api/users')
			.send({
				username: 'hafiz',
				password: 'rahasia',
				name: 'Muhammad Hafiz'
			});

		logger.info(result.body);

		expect(result.status).toBe(200);
		expect(result.body.data.username).toBe("hafiz");
		expect(result.body.data.name).toBe("Muhammad Hafiz");
		expect(result.body.data.password).toBeUndefined();

		result = await supertest(web)
			.post('/api/users')
			.send({
				username: 'hafiz',
				password: 'rahasia',
				name: 'Muhammad Hafiz'
			});

		logger.info(result.body);

		expect(result.status).toBe(400);
		expect(result.body.errors).toBeDefined()

	});



});
