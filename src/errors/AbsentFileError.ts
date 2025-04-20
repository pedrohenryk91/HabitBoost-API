export class AbsentFileError extends Error {
    constructor(){
        super("There is no file on the request")
    }
}