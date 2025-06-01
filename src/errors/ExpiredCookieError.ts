export class ExpiredCookieError extends Error {
    constructor(){
        super("The cookie is expired")
    }
}