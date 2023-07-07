import { createTestUser, removeAllTestContacts, removeTestUser } from "./test-util"
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
	})

})