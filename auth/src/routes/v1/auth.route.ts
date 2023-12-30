import express, { type Router } from 'express';

import * as authController from '../../controllers/v1/auth.controller';

const authRouter: Router = express.Router();

authRouter.route('/signup').post(authController.handleSignup);
authRouter.route('/signin').post(authController.handleSignin);
authRouter.route('/signout').post(authController.handleSignout);
authRouter.route('/currentuser').get(authController.handleGetCurrentUser);

export default authRouter;