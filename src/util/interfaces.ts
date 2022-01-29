import { Request } from "express";

export interface Req extends Request {
    userId ?: number
}

export interface Err extends Error {
	status ?: number
}