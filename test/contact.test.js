import { createTestContact, createTestUser, getTestContact, removeAllTestContacts, removeTestUser, createManyTestContacts } from "./test-util"
import supertest from "supertest";
import { web } from "../src/application/web.js";
import { logger } from "../src/application/logging";


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

describe('PUT /api/contacts/:contactId', function () {
	beforeEach(async () => {
		await createTestUser();
		await createTestContact();
	})

	afterEach(async () => {
		await removeAllTestContacts();
		await removeTestUser();
	})

	it('Should can update existing contact', async () => {
		const testContact = await getTestContact();

		const result = await supertest(web)
			.put('/api/contacts/' + testContact.id)
			.set('Authorization', 'test')
			.send({
				first_name: "Muhammad",
				last_name: "Hafiz",
				email: "hafiz@hfz.com",
				phone: "0823232311"
			});

		expect(result.status).toBe(200);
		expect(result.body.data.id).toBe(testContact.id);
		expect(result.body.data.first_name).toBe("Muhammad");
		expect(result.body.data.last_name).toBe("Hafiz");
		expect(result.body.data.email).toBe("hafiz@hfz.com");
		expect(result.body.data.phone).toBe("0823232311");
	});

	it('Should reject if request is invalid', async () => {
		const testContact = await getTestContact();

		const result = await supertest(web)
			.put('/api/contacts/' + testContact.id)
			.set('Authorization', 'test')
			.send({
				first_name: "",
				last_name: "",
				email: "hafiz",
				phone: ""
			});

		expect(result.status).toBe(400);
	});

	it('Should reject if contact is not found', async () => {
		const testContact = await getTestContact();

		const result = await supertest(web)
			.put('/api/contacts/' + testContact.id + 1)
			.set('Authorization', 'test')
			.send({
				first_name: "Muhammad",
				last_name: "Hafiz",
				email: "hafiz@hfz.com",
				phone: "0823232311"
			});

		expect(result.status).toBe(404);
	});
});

describe('DELETE /api/contacts/:contactId', function () {
	beforeEach(async () => {
		await createTestUser();
		await createTestContact();
	})

	afterEach(async () => {
		await removeAllTestContacts();
		await removeTestUser();
	})

	it('Should can delete contact', async () => {
		let testContact = await getTestContact();

		const result = await supertest(web)
			.delete('/api/contacts/' + testContact.id)
			.set('Authorization', 'test');

		expect(result.status).toBe(200);
		expect(result.body.data).toBe("OK");

		testContact = await getTestContact();
		expect(testContact).toBeNull();
	});

	it('Should reject if contact is not found', async () => {
		let testContact = await getTestContact();

		const result = await supertest(web)
			.delete('/api/contacts/' + (testContact.id + 1))
			.set('Authorization', 'test');

		expect(result.status).toBe(404);
	});
});

describe('GET /api/contacts', () => {
	beforeEach(async () => {
		await createTestUser();
		await createManyTestContacts();
	})

	afterEach(async () => {
		await removeAllTestContacts();
		await removeTestUser();
	})

	it('Should can search without paramater', async () => {
		const result = await supertest(web)
			.get('/api/contacts')
			.set('Authorization', 'test');

		expect(result.status).toBe(200);
		expect(result.body.data.length).toBe(10);
		expect(result.body.paging.page).toBe(1);
		expect(result.body.paging.total_page).toBe(2);
		expect(result.body.paging.total_item).toBe(15);
	});

	it('Should can search to page 2', async () => {
		const result = await supertest(web)
			.get('/api/contacts')
			.query({
				page: 2
			})
			.set('Authorization', 'test');

		expect(result.status).toBe(200);
		expect(result.body.data.length).toBe(5);
		expect(result.body.paging.page).toBe(2);
		expect(result.body.paging.total_page).toBe(2);
		expect(result.body.paging.total_item).toBe(15);
	});

	it('Should can search using name', async () => {
		const result = await supertest(web)
			.get('/api/contacts')
			.query({
				name: "test 1"
			})
			.set('Authorization', 'test');

		expect(result.status).toBe(200);
		expect(result.body.data.length).toBe(6);
		expect(result.body.paging.page).toBe(1);
		expect(result.body.paging.total_page).toBe(1);
		expect(result.body.paging.total_item).toBe(6);
	});

	it('Should can search using email', async () => {
		const result = await supertest(web)
			.get('/api/contacts')
			.query({
				email: "test1"
			})
			.set('Authorization', 'test');

		expect(result.status).toBe(200);
		expect(result.body.data.length).toBe(6);
		expect(result.body.paging.page).toBe(1);
		expect(result.body.paging.total_page).toBe(1);
		expect(result.body.paging.total_item).toBe(6);
	});

	it('Should can search using phone', async () => {
		const result = await supertest(web)
			.get('/api/contacts')
			.query({
				phone: "0829090901"
			})
			.set('Authorization', 'test');

		expect(result.status).toBe(200);
		expect(result.body.data.length).toBe(6);
		expect(result.body.paging.page).toBe(1);
		expect(result.body.paging.total_page).toBe(1);
		expect(result.body.paging.total_item).toBe(6);
	});

});


