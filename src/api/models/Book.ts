import dynamodbLib from "../../libs/dynamo";
import { Book } from "types/Book"
import * as uuid from 'uuid'
import User from "./User";
import { UserBooks } from "types/User";

const TableName = process.env.MAIN_TABLE

/**
 * Gets a book by id from a specific user
 * @param userId the owner id
 * @param bookID the book id
 * @returns a book object
 */
export const getBookByID = async (userId: string, bookID: string): Promise<Book> => {
    try {
        return (await dynamodbLib.get({
            TableName,
            Key: {
                "PK": `USER#${userId}`,
                "SK": `BOOK#${bookID}`,
            }
        })).Item as Book

    } catch (error) {
        console.log(error)
    }
}

/**
 * Creates or updates a book
 * @param data the book object
 * @param userId the owner id
 * @param bookID the book id
 * @returns a book object
 */
const createUpdateBook = async (data: Book, userId: string, bookID?: string): Promise<Book> => {
    const existing = await getBookByID(userId, bookID)
    const updated = { ...existing, ...data }

    if (!existing) {
        updated.PK = `USER#${userId}`
        updated.SK = `BOOK#${uuid.v4()}`
    }

    await dynamodbLib.put({ TableName, Item: updated })
    return updated;
}

/**
 * Returns a user object with a list of books by user
 * @param userID the user is
 * @returns a user profile with their books
 */
export const getBooksByUser = async (userID: string): Promise<UserBooks> => {
    const user = await User.getUserByID(userID)

    const books = (await dynamodbLib.query({
        TableName,
        ExpressionAttributeValues: {
            ":PK": `USER#${userID}`,
            ":SK": 'BOOK#'
        },
        ExpressionAttributeNames: {
            "#PK": "PK",
            "#SK": "SK"
        },
        KeyConditionExpression: "#PK = :PK AND begins_with(#SK, :SK)"
    })).Items as Book[]

    const userWithBooks: UserBooks = {
        ...user,
        books: [...books]
    }

    return userWithBooks
}

/**
 * Gets a list of books - must be validated, maybe works with scan shouldn't be the best way to do that
 * @returns a list of books
 */
export const getBooks = async (): Promise<Book[]> => {
    const books = (await dynamodbLib.scan({
        TableName,
        ExpressionAttributeValues: {
            ":PK": 'USER#',
            ":SK": 'BOOK#'
        },
        ExpressionAttributeNames: {
            "#PK": "PK",
            "#SK": "SK"
        },
        FilterExpression: "begins_with(#PK, :PK) AND begins_with(#SK, :SK)"
        // KeyConditionExpression: "begins_with(#PK, :PK) AND begins_with(#SK, :SK)"
    })).Items as Book[]

    return books
}

/**
 * Gets a list of books by a keyword - must be validated, maybe works with scan shouldn't be the best way to do that
 * @returns a list of books
 */
export const searchBooks = async (): Promise<Book[]> => {

    // must be update according to the body request and should be improved to support logical operators
    const searchParams = {
        author: 'Lewis',
        title: 'The'
    }

    let FilterExpression = "begins_with(#PK, :PK) AND begins_with(#SK, :SK)"

    const ExpressionAttributeNames = {
        "#PK": "PK",
        "#SK": "SK"
    }

    Object.keys(searchParams).map((key, i) => {
        ExpressionAttributeNames[`#${key}`] = key
        FilterExpression += ` AND contains(#${key}, :${key})`
    })

    const ExpressionAttributeValues = {
        ":PK": 'USER#',
        ":SK": 'BOOK#'
    }

    Object.entries(searchParams).map((item, i) => {
        ExpressionAttributeValues[`:${item[0]}`] = item[1]
    })

    const books = (await dynamodbLib.scan({
        TableName,
        ExpressionAttributeValues,
        ExpressionAttributeNames,
        FilterExpression
    })).Items as Book[]

    return books
}

export default {
    getBookByID,
    createUpdateBook,
    getBooksByUser,
    getBooks,
    searchBooks
}