import supertest from "supertest";
import {
	createTestUser,
	createTestContact,
	createTestAddress, getTestAddress, getTestContact,
	removeAllTestAddresses,
	removeAllTestContacts, removeTestUser
} from "./test-util.js";
import { web } from "../src/application/web";
import { logger } from "../src/application/logging.js";

describe('POST /api/contacts/:contactId/addresses', () => {
	beforeEach(async () => {
		await createTestUser();
		await createTestContact();
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

describe('GET /api/contacts/:contactId/addresses/:addressId', () => {
	beforeEach(async () => {
		await createTestUser();
		await createTestContact();
		await createTestAddress();
	})

	afterEach(async () => {
		await removeAllTestAddresses();
		await removeAllTestContacts();
		await removeTestUser();
	})

	it('Should can get contact', async () => {
		const testContact = await getTestContact();
		const testAddress = await getTestAddress();

		const result = await supertest(web)
			.get('/api/contacts/' + testContact.id + '/addresses/' + testAddress.id)
			.set('Authorization', 'test');

		expect(result.status).toBe(200);
		expect(result.body.data.id).toBeDefined();
		expect(result.body.data.street).toBe("Jalan test");
		expect(result.body.data.city).toBe("Kota test");
		expect(result.body.data.province).toBe("Provinsi test");
		expect(result.body.data.country).toBe("Indonesia");
		expect(result.body.data.postal_code).toBe("12345");
	});

	it('Should reject if contact is not found', async () => {
		const testContact = await getTestContact();
		const testAddress = await getTestAddress();

		const result = await supertest(web)
			.get('/api/contacts/' + (testContact.id + 1) + '/addresses/' + testAddress.id)
			.set('Authorization', 'test');

		expect(result.status).toBe(404);
	});

	it('Should reject if address is not found', async () => {
		const testContact = await getTestContact();
		const testAddress = await getTestAddress();

		const result = await supertest(web)
			.get('/api/contacts/' + testContact.id + '/addresses/' + (testAddress.id + 1))
			.set('Authorization', 'test');

		expect(result.status).toBe(404);
	});
});

describe('PUT /api/contacts/:contactId/addresses/:addressId', () => {
	beforeEach(async () => {
		await createTestUser();
		await createTestContact();
		await createTestAddress();
	})

	afterEach(async () => {
		await removeAllTestAddresses();
		await removeAllTestContacts();
		await removeTestUser();
	})

	it('Should can update address', async () => {
		const testContact = await getTestContact();
		const testAddress = await getTestAddress();

		const result = await supertest(web)
			.put('/api/contacts/' + testContact.id + '/addresses/' + testAddress.id)
			.set('Authorization', 'test')
			.send({
				street: "Jalan update",
				city: "Kota update",
				province: "Provinsi update",
				country: "Indonesia",
				postal_code: "12346"
			});

		expect(result.status).toBe(200);
		expect(result.body.data.id).toBe(testAddress.id);
		expect(result.body.data.street).toBe("Jalan update");
		expect(result.body.data.city).toBe("Kota update");
		expect(result.body.data.province).toBe("Provinsi update");
		expect(result.body.data.country).toBe("Indonesia");
		expect(result.body.data.postal_code).toBe("12346");
	});

	it('Should reject if request is not valid', async () => {
		const testContact = await getTestContact();
		const testAddress = await getTestAddress();

		const result = await supertest(web)
			.put('/api/contacts/' + testContact.id + '/addresses/' + testAddress.id)
			.set('Authorization', 'test')
			.send({
				street: "Jalan update",
				city: "Kota update",
				province: "Provinsi update",
				country: "",
				postal_code: ""
			});

		expect(result.status).toBe(400);
	});

	it('Should reject if address is not found', async () => {
		const testContact = await getTestContact();
		const testAddress = await getTestAddress();

		const result = await supertest(web)
			.put('/api/contacts/' + testContact.id + '/addresses/' + (testAddress.id + 1))
			.set('Authorization', 'test')
			.send({
				street: "Jalan update",
				city: "Kota update",
				province: "Provinsi update",
				country: "Indonesia",
				postal_code: "123456"
			});

		expect(result.status).toBe(404);
	});

	it('Should reject if contact is not found', async () => {
		const testContact = await getTestContact();
		const testAddress = await getTestAddress();

		const result = await supertest(web)
			.put('/api/contacts/' + (testContact.id + 1) + '/addresses/' + testAddress.id)
			.set('Authorization', 'test')
			.send({
				street: "Jalan update",
				city: "Kota update",
				province: "Provinsi update",
				country: "Indonesia",
				postal_code: "123456"
			});

		expect(result.status).toBe(404);
	});
});

describe('DELETE /api/contacts/:contactId/addresses/:addressId', () => {
	beforeEach(async () => {
		await createTestUser();
		await createTestContact();
		await createTestAddress();
	})

	afterEach(async () => {
		await removeAllTestAddresses();
		await removeAllTestContacts();
		await removeTestUser();
	})

	it('Should can remove address', async () => {
		const testContact = await getTestContact();
		let testAddress = await getTestAddress();

		const result = await supertest(web)
			.delete('/api/contacts/' + testContact.id + '/addresses/' + testAddress.id)
			.set('Authorization', 'test');

		expect(result.status).toBe(200);
		expect(result.body.data).toBe("OK");

		testAddress = await getTestAddress();
		expect(testAddress).toBeNull();
	})

	it('Should reject if address is not found', async () => {
		const testContact = await getTestContact();
		let testAddress = await getTestAddress();

		const result = await supertest(web)
			.delete('/api/contacts/' + testContact.id + '/addresses/' + (testAddress.id + 1))
			.set('Authorization', 'test');

		expect(result.status).toBe(404);
	})

	it('Should reject if contact is not found', async () => {
		const testContact = await getTestContact();
		let testAddress = await getTestAddress();

		const result = await supertest(web)
			.delete('/api/contacts/' + (testContact.id + 1) + '/addresses/' + testAddress.id)
			.set('Authorization', 'test');

		expect(result.status).toBe(404);
	})

});





