import express, { Request, Response } from 'express';

import { getUserByEmail, createUser, getUserBySessionToken } from '../db/users'
import { User } from '../../types';

import { random, authentication } from '../helpers';

export const login = async (req: Request, res: express.Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.sendStatus(400);
        }

        const user: User | null = await getUserByEmail(email).select('+authentication.salt +authentication.password');

        if (!user) {
            return res.sendStatus(400);
        }

        const expectedHash = authentication(user.authentication.salt, password);

        if (user.authentication?.password !== expectedHash) {
            res.sendStatus(403);
        }

        const salt = random();
        user.authentication.sessionToken = authentication(salt, user._id.toString());

        await user.save();

        res.cookie(process.env.SECRET!, user.authentication?.sessionToken, { domain: 'localhost', path: '/' });

        return res.status(200).json(user).end();
    } catch (error) {
        console.log(error);
        res.sendStatus(400)
    }
}

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password, username } = req.body;

        if (!email || !password || !username) {
            return res.sendStatus(400);
        }

        const existingUser = await getUserByEmail(email)

        if (existingUser) {
            return res.sendStatus(400);
        }

        const salt = random();
        const user = await createUser({
            email,
            username,
            authentication: {
                salt,
                password: authentication(salt, password),
            }
        })

        return res.status(200).json(user).end();
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const fetchUser = async (req: Request, res: Response) => {
    try {
        const sessionToken = req.cookies[process.env.SECRET];

        if (!sessionToken) {
            return res.status(401);
        }

        const currentUser = await getUserBySessionToken(sessionToken);

        if (!currentUser) {
            return null;
        }

        return res.status(200).json(currentUser).end();
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}

export const logout = (req: Request, res: Response) => {
    try {
        res.clearCookie(process.env.SECRET!, { domain: 'localhost', path: '/' })

        res.status(200).json({ message: "Logout Successful." })
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }

}