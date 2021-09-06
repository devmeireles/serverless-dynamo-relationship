import dynamodbLib from "../../libs/dynamo";
import { User } from "types/User"

const TableName = process.env.MAIN_TABLE

export const getUserByID = async (id: string): Promise<User> => {
    try {
        return (await dynamodbLib.get({
            TableName,
            Key: {
                "PK": `USER#${id}`,
                "SK": `PROFILE#${id}`,
            }
        })).Item as User

    } catch (error) {
        console.log(error)
    }
}

/**
 * Creates or updates a user
 * @param data the user data
 * @param userID the user id
 * @returns an user object
 */
const createUpdateUser = async (data: User, userID: string): Promise<User> => {
    const existing = await getUserByID(userID)
    const updated = { ...existing, ...data }

    updated.PK = `USER#${userID}`
    updated.SK = `PROFILE#${userID}`

    await dynamodbLib.put({ TableName, Item: updated })
    return updated;
}

export default {
    getUserByID,
    createUpdateUser,
}