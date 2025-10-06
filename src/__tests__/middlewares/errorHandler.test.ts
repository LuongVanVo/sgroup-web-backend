import { errorHandler } from "@/middlewares/errorHandler";
import { Request, Response, NextFunction } from "express";

describe('errorHandler middleware', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        req = {};
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }
        next = jest.fn();
        console.error = jest.fn()
    })

    it (`should return 500 if no status is provided`, () => {
        const err = new Error('Something went wrong')

        errorHandler(err, req as Request, res as Response, next)

        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'Something went wrong'
        })
    })
    it (`should return provided status if err.status is set`, () => {
        const err: any = new Error('Not Found')
        err.status = 404
        
        errorHandler(err, req as Request, res as Response, next)

        expect(res.status).toHaveBeenCalledWith(404)
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'Not Found'
        })
    })
    it (`should log the error message to console`, () => {
        const err = new Error('Database connection failed')
        errorHandler(err, req as Request, res as Response, next)

        expect(console.error).toHaveBeenCalledWith('Error caught: ', 'Database connection failed')
    })
})