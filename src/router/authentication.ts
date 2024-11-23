import express, { Router } from 'express';

import { register, login, logout, fetchUser } from '../controllers/authentication'

export default (router: Router) => {
    router.post('/auth/register', register as any);
    router.post('/auth/login', login as any);
    router.post('/logout', logout as any);
    router.get('/user', fetchUser as any);
}