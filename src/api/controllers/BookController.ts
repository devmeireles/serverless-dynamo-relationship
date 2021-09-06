import BookModel from 'api/models/Book'
import { APIGatewayEvent } from 'aws-lambda'
import { getUserId, handler } from 'libs/handler'
import { Book } from 'types/Book'

export const createUpdateBook = handler(
    async (event: APIGatewayEvent): Promise<Book> => {

        const data = JSON.parse(event.body) as Book
        const owner = getUserId(event)
        const bookID = event.pathParameters?.id

        return await BookModel.createUpdateBook(data, owner, bookID)
    }
)