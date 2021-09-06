import { Book } from "./Book"

export type User = {
    PK?: string;
    SK?: string;
    name: string;
    email: string;
}

export type UserBooks = User &{
    books: Book[]
}