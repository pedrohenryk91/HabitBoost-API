export class IncorrectParamError extends Error {
    constructor(param: string){
        super(`The '${param}' param is incorrect`)
    }
}