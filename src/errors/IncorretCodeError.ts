export class IncorrectCodeError extends Error {
    constructor(){
        super("The recover code is incorrect")
    }
}