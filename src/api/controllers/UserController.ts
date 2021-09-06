import UserModel from 'api/models/User'
import { APIGatewayEvent } from 'aws-lambda'
import { getUserId, handler } from 'libs/handler'
import { User } from 'types/User'

export const createUpdateUser = handler(
    async (event: APIGatewayEvent): Promise<User> => {
        const data = JSON.parse(event.body) as User
        const owner = getUserId(event)

        return await UserModel.createUpdateUser(data, owner)
    }
)