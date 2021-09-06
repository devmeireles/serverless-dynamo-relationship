import UserModel from 'api/models/User'
import BookModel from 'api/models/Book'
import { APIGatewayEvent } from 'aws-lambda'
import { getUserId, handler } from 'libs/handler'
import { User, UserBooks } from 'types/User'

export const createUpdateUser = handler(
    async (event: APIGatewayEvent): Promise<User> => {
        const data = JSON.parse(event.body) as User
        const owner = getUserId(event)

        return await UserModel.createUpdateUser(data, owner)
    }
)

export const getBooksByUser = handler(
    async (event: APIGatewayEvent): Promise<UserBooks> => {
        const owner = getUserId(event)

        return await BookModel.getBooksByUser(owner)
    }
)