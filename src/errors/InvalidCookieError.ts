export class InvalidCookieError extends Error {
    constructor(){
        super("The cookie is invalid")
    }
}