/**
 * Class that indicate that some unique field is already in use
 * @param item Name of the field
 * @example
 * ```typescript
 * throw new AlreadyInUseError("name")
 * //message: name already in use
 * ```
 */
export class AlreadyInUseError extends Error {
    constructor(item: string){
        super(`${item} already in use`);
    }
}