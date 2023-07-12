import supertest from "supertest";
import { createTestUser, createManyTestContacts, removeAllTestAddresses, removeAllTestContacts, removeTestUser, getTestContact } from "./test-util.js";
import { web } from "../src/application/web";
import { logger } from "../src/application/logging";

describe('POST /api/contacts/:contactId/addresses', () => {
	beforeEach(async () => {
		await createTestUser();
		await createManyTestContacts();
	})

	afterEach(async () => {
		await removeAllTestAddresses();
		await removeAllTestContacts();
		await removeTestUser();
	})

	it('Should can create new address', async () => {
		const testContact = await getTestContact();

		const result = await supertest(web)
			.post('/api/contacts/' + testContact.id + '/addresses')
			.set('Authorization', 'test')
			.send({
				street: "Jalan test",
				city: "Kota test",
				province: "Provinsi test",
				country: "Indonesia",
				postal_code: "12345"
			});

		expect(result.status).toBe(200);
		expect(result.body.data.id).toBeDefined();
		expect(result.body.data.street).toBe("Jalan test");
		expect(result.body.data.city).toBe("Kota test");
		expect(result.body.data.province).toBe("Provinsi test");
		expect(result.body.data.country).toBe("Indonesia");
		expect(result.body.data.postal_code).toBe("12345");
	});

	it('Should reject if address request is invalid', async () => {
		const testContact = await getTestContact();

		const result = await supertest(web)
			.post('/api/contacts/' + testContact.id + '/addresses')
			.set('Authorization', 'test')
			.send({
				street: "Jalan test",
				city: "Kota test",
				province: "Provinsi test",
				country: "",
				postal_code: ""
			});

		expect(result.status).toBe(400);
	});

	it('Should reject if contact is not found', async () => {
		const testContact = await getTestContact();

		const result = await supertest(web)
			.post('/api/contacts/' + (testContact.id + 1) + '/addresses')
			.set('Authorization', 'test')
			.send({
				street: "Jalan test",
				city: "Kota test",
				province: "Provinsi test",
				country: "",
				postal_code: ""
			});

		expect(result.status).toBe(404);
	});
});
