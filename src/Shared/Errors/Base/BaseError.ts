export class ProjectErrors extends Error{
    constructor(
        public statusCode:number,
        public code:string,
        message:string,
    ) {
        super(message)
        this.name=this.constructor.name
        Object.setPrototypeOf(this,new.target.prototype)
    }
}