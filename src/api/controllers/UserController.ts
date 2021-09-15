import UserModel from '../models/User'
import { APIGatewayEvent } from 'aws-lambda'
import { getUserId, handler } from '../../libs/handler'
import { User } from '../../types/User'

export const createUpdateUser = handler(
    async (event: APIGatewayEvent): Promise<User> => {
        // console.log(event.requestContext)
        const data = JSON.parse(event.body) as User
        const owner = getUserId(event)

        // console.log(owner)

        return await UserModel.createUpdateUser(data, owner)
    }
)