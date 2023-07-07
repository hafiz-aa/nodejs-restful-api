import { createTestContact, createTestUser, getTestContact, removeAllTestContacts, removeTestUser } from "./test-util"
import supertest from "supertest";
import { web } from "../src/application/web.js";


describe('POST /api/contacts', function () {
	beforeEach(async () => {
		await createTestUser();
	})

	afterEach(async () => {
		await removeAllTestContacts();
		await removeTestUser();
	})

	it('Should can create new contact', async () => {
		const result = await supertest(web)
			.post("/api/contacts")
			.set('Authorization', 'test')
			.send({
				first_name: "test",
				last_name: "test",
				email: "test@hfz.com",
				phone: "082909090"
			});

		expect(result.status).toBe(200);
		expect(result.body.data.id).toBeDefined();
		expect(result.body.data.first_name).toBe("test");
		expect(result.body.data.last_name).toBe("test");
		expect(result.body.data.email).toBe("test@hfz.com");
		expect(result.body.data.phone).toBe("082909090");
	})

	it('Should reject if request is not valid', async () => {
		const result = await supertest(web)
			.post("/api/contacts")
			.set('Authorization', 'test')
			.send({
				first_name: "",
				last_name: "test",
				email: "test@hfz.com",
				phone: "0829090900-0-0-0--909009-0--6767"
			});

		expect(result.status).toBe(400);
		expect(result.body.errors).toBeDefined();
	});
});

describe('GET /api/contacts/:contactId', function () {
	beforeEach(async () => {
		await createTestUser();
		await createTestContact();
	})

	afterEach(async () => {
		await removeAllTestContacts();
		await removeTestUser();
	})

	it('Should can get contact', async () => {
		const testContact = await getTestContact();

		const result = await supertest(web)
			.get("/api/contacts/" + testContact.id)
			.set('Authorization', 'test');

		expect(result.status).toBe(200);
		expect(result.body.data.id).toBe(testContact.id);
		expect(result.body.data.first_name).toBe(testContact.first_name);
		expect(result.body.data.last_name).toBe(testContact.last_name);
		expect(result.body.data.email).toBe(testContact.email);
		expect(result.body.data.phone).toBe(testContact.phone);
	})

	it('Should return 404 if contactId is not found', async () => {
		const testContact = await getTestContact();

		const result = await supertest(web)
			.get("/api/contacts/" + (testContact.id + 1))
			.set('Authorization', 'test');

		expect(result.status).toBe(404);
	})
})