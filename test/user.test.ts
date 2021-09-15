import * as faker from 'faker'
import { User } from "types/User"
import { createUpdateUser, getUserProfile } from "../src/api/controllers/UserController"
import { context, event } from './helpers/mocks'

const USER_IDENTITY = 'offlineContext_cognitoIdentityIdDEVELOPER-1'

describe('POST /', () => {
    it("It shouldn't create an user because the body is empty", async () => {
        const { body, statusCode } = await createUpdateUser(event, context)

        expect(statusCode).toEqual(500)
    })

    it("It should create an user", async () => {
        event.body = JSON.stringify({
            name: faker.name.findName(),
            gender: 'M',
            email: faker.internet.email()
        })

        event.requestContext.identity.cognitoIdentityId = USER_IDENTITY

        const { body, statusCode } = await createUpdateUser(event, context)
        const formatedBody: User = JSON.parse(body)

        expect(statusCode).toEqual(200)
        expect(formatedBody).toHaveProperty("SK")
        expect(formatedBody).toHaveProperty("PK")
        expect(formatedBody).toHaveProperty("name")
        expect(formatedBody).toHaveProperty("email")
    })

    it("It should return the logged user", async () => {
        const { body, statusCode } = await getUserProfile(event, context)
        const formatedBody: User = JSON.parse(body)

        expect(statusCode).toEqual(200)
        expect(formatedBody).toHaveProperty("SK")
        expect(formatedBody).toHaveProperty("PK")
        expect(formatedBody).toHaveProperty("name")
        expect(formatedBody).toHaveProperty("email")
    })

    it("It shouldn't return the logged user because the cognitoIdentityId is wrong", async () => {
        event.requestContext.identity.cognitoIdentityId = faker.datatype.uuid()

        const { body, statusCode } = await getUserProfile(event, context)

        expect(statusCode).toEqual(200)
        expect(body).toBeUndefined()
    })
})