import supertest from "supertest";
import { web } from "../src/application/web.js";
import { logger } from "../src/application/logging.js";
import { createTestUser, getTestUser, removeTestUser } from "./test-util.js";
import bcrypt from "bcrypt";

// Test suite for POST /api/users
describe('POST /api/users', function () {

	// Clean up after each test
	afterEach(async () => {
		await removeTestUser();
	})

	// Test case: Should be able to register a new user
	it('Should can register new user', async () => {
		const result = await supertest(web)
			.post('/api/users')
			.send({
				username: 'test',
				password: 'rahasia',
				name: 'test'
			});

		// Assertions
		expect(result.status).toBe(200);
		expect(result.body.data.username).toBe("test");
		expect(result.body.data.name).toBe("test");
		expect(result.body.data.password).toBeUndefined();
	});

	// Test case: Should reject registration if request is invalid
	it('Should reject if request is invalid', async () => {
		const result = await supertest(web)
			.post('/api/users')
			.send({
				username: '',
				password: '',
				name: ''
			});

		logger.info(result.body);

		// Assertions
		expect(result.status).toBe(400);
		expect(result.body.errors).toBeDefined()
	})

	// Test case: Should reject registration if username is already registered
	it('Should reject if username already registered', async () => {
		let result = await supertest(web)
			.post('/api/users')
			.send({
				username: 'test',
				password: 'rahasia',
				name: 'test'
			});

		logger.info(result.body);

		// Assertions
		expect(result.status).toBe(200);
		expect(result.body.data.username).toBe("test");
		expect(result.body.data.name).toBe("test");
		expect(result.body.data.password).toBeUndefined();

		result = await supertest(web)
			.post('/api/users')
			.send({
				username: "test",
				password: "rahasia",
				name: "test"
			});

		logger.info(result.body);

		// Assertions
		expect(result.status).toBe(400);
		expect(result.body.errors).toBeDefined()
	});
});

// Test suite for POST /api/users/login
describe('POST /api/users/login', function () {
	beforeEach(async () => {
		await createTestUser();
	});

	afterEach(async () => {
		await removeTestUser();
	});

	// Test case: Should be able to login
	it('Should can login', async () => {
		const result = await supertest(web)
			.post('/api/users/login')
			.send({
				username: "test",
				password: "rahasia"
			});

		logger.info(result.body);

		// Assertions
		expect(result.status).toBe(200);
		expect(result.body.data.token).toBeDefined();
		expect(result.body.data.token).not.toBe("test");
	});

	// Test case: Should reject login if request is invalid
	it('should reject login if request is invalid', async () => {
		const result = await supertest(web)
			.post('/api/users/login')
			.send({
				username: "",
				password: ""
			});

		logger.info(result.body);

		// Assertions
		expect(result.status).toBe(400);
		expect(result.body.errors).toBeDefined();
	});

	// Test case: Should reject login if password is wrong
	it('should reject login if password is wrong', async () => {
		const result = await supertest(web)
			.post('/api/users/login')
			.send({
				username: "test",
				password: "salah"
			});

		logger.info(result.body);

		// Assertions
		expect(result.status).toBe(401);
		expect(result.body.errors).toBeDefined();
	});

	// Test case: Should reject login if username is wrong
	it('should reject login if username is wrong', async () => {
		const result = await supertest(web)
			.post('/api/users/login')
			.send({
				username: "salah",
				password: "salah"
			});

		logger.info(result.body);

		// Assertions
		expect(result.status).toBe(401);
		expect(result.body.errors).toBeDefined();
	});
});

// Test suite for GET /api/users/current
describe('GET /api/users/current', function () {
	beforeEach(async () => {
		await createTestUser();
	});

	afterEach(async () => {
		await removeTestUser();
	});

	// Test case: Should be able to get current user
	it('Should can get current user', async () => {
		const result = await supertest(web)
			.get('/api/users/current')
			.set('Authorization', 'test');

		// Assertions
		expect(result.status).toBe(200);
		expect(result.body.data.username).toBe('test');
		expect(result.body.data.name).toBe('test');
	})

	// Test case: Should reject if token is invalid
	it('Should can reject if token is invalid', async () => {
		const result = await supertest(web)
			.get('/api/users/current')
			.set('Authorization', 'salah');

		// Assertions
		expect(result.status).toBe(401);
		expect(result.body.errors).toBeDefined();
	});
});

// Test suite for PATCH /api/users/current
describe('PATCH /api/users/current', function () {
	beforeEach(async () => {
		await createTestUser();
	});

	afterEach(async () => {
		await removeTestUser();
	});

	// Test case: Should be able to update user
	it('Should can update user', async () => {
		const result = await supertest(web)
			.patch("/api/users/current")
			.set("Authorization", "test")
			.send({
				name: "Nera",
				password: "rahasialagi"
			});

		// Assertions
		expect(result.status).toBe(200);
		expect(result.body.data.username).toBe("test");
		expect(result.body.data.name).toBe("Nera");

		const user = await getTestUser();
		expect(await bcrypt.compare("rahasialagi", user.password)).toBe(true);
	});

	// Test case: Should be able to update user name
	it('Should can update user name', async () => {
		const result = await supertest(web)
			.patch("/api/users/current")
			.set("Authorization", "test")
			.send({
				name: "Nera"
			});

		// Assertions
		expect(result.status).toBe(200);
		expect(result.body.data.username).toBe("test");
		expect(result.body.data.name).toBe("Nera");
	});

	// Test case: Should be able to update user password
	it('Should can update user password', async () => {
		const result = await supertest(web)
			.patch("/api/users/current")
			.set("Authorization", "test")
			.send({
				password: "rahasialagi"
			});

		// Assertions
		expect(result.status).toBe(200);
		expect(result.body.data.username).toBe("test");
		expect(result.body.data.name).toBe("test");

		const user = await getTestUser();
		expect(await bcrypt.compare("rahasialagi", user.password)).toBe(true);
	});

	// Test case: Should reject if request is not valid
	it('Should reject if request is not valid', async () => {
		const result = await supertest(web)
			.patch("/api/users/current")
			.set("Authorization", "salah")
			.send({});

		// Assertions
		expect(result.status).toBe(401);
	});
});

// Test suite for DELETE api/users/logout
describe('DELETE api/users/logout', function () {
	beforeEach(async () => {
		await createTestUser();
	});

	afterEach(async () => {
		await removeTestUser();
	});

	// Test case: Should be able to logout
	it('Should can logout', async () => {
		const result = await supertest(web)
			.delete('/api/users/logout')
			.set('Authorization', 'test');

		// Assertions
		expect(result.status).toBe(200);
		expect(result.body.data).toBe("OK");

		const user = await getTestUser();
		expect(user.token).toBeNull();
	});

	// Test case: Should reject logout if token is invalid
	it('Should reject logout if token is invalid', async () => {
		const result = await supertest(web)
			.delete('/api/users/logout')
			.set('Authorization', 'salah');

		// Assertions
		expect(result.status).toBe(401);
	});
});
