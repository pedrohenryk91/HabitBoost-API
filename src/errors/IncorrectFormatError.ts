export class IncorrectFormatError extends Error {
    constructor(){
        super("Token format is incorrect, it was expected another format")
    }
}