import BookModel from 'api/models/Book'
import { APIGatewayEvent } from 'aws-lambda'
import { getUserId, handler } from 'libs/handler'
import { Book } from 'types/Book'
import { UserBooks } from 'types/User'

export const createUpdateBook = handler(
    async (event: APIGatewayEvent): Promise<Book> => {

        const data = JSON.parse(event.body) as Book
        const owner = getUserId(event)
        const bookID = event.pathParameters?.id

        return await BookModel.createUpdateBook(data, owner, bookID)
    }
)

export const getBookByID = handler(
    async (event: APIGatewayEvent): Promise<Book> => {
        const owner = getUserId(event)
        const bookID = event.pathParameters?.id

        return await BookModel.getBookByID(owner, bookID)
    }
)

export const getBooksByUser = handler(
    async (event: APIGatewayEvent): Promise<UserBooks> => {
        const owner = getUserId(event)

        return await BookModel.getBooksByUser(owner)
    }
)

export const listBooks = handler(
    async (event: APIGatewayEvent): Promise<Book[]> => {
        return await BookModel.getBooks()
    }
)

export const searchBooks = handler(
    async (event: APIGatewayEvent): Promise<Book[]> => {
        // const owner = getUserId(event)

        return await BookModel.searchBooks()
    }
)