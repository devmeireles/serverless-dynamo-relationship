import { User } from "types/User"
import { createUpdateUser } from "../src/api/controllers/UserController"
import { context, event } from './helpers/mocks'

describe('POST /', () => {
    it("It shouldn't create an user because the body is empty", async () => {
        const { body, statusCode } = await createUpdateUser(event, context)

        expect(statusCode).toEqual(500)
    })

    it("It should create an user", async () => {
        event.body = JSON.stringify({
            name: 'Gabriel Meireles',
            gender: 'M',
            email: 'gabriel@mail.com'
        })

        event.requestContext.identity.cognitoIdentityId = 'offlineContext_cognitoIdentityIdDEVELOPER-1'

        const { body, statusCode } = await createUpdateUser(event, context)
        const formatedBody: User = JSON.parse(body)

        expect(statusCode).toEqual(200)
        expect(formatedBody).toHaveProperty("SK")
        expect(formatedBody).toHaveProperty("PK")
        expect(formatedBody).toHaveProperty("name")
        expect(formatedBody).toHaveProperty("email")
    })
})