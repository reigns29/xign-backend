import express, {Router} from 'express';

const router = express.Router();

import authentication from './authentication';

export default () : Router => {
    authentication(router);
    
    return router;
};