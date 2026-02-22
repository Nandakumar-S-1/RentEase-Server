import {Request,Response, NextFunction } from "express";

export interface IErrorMiddleware{
    handleError(
        err:Error,
        req:Request,
        res:Response,
        next:NextFunction
    ):Response
}