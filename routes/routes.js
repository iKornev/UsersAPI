import {
  userSignUp,
  userSignIn,
  getUserProfile,
  updateUserProfile,
  uploadUserImage,
  deleteUser,
} from '../controllers/UsersController.mjs'
import uploader from '../middleware/fileUploader/uploader'
import passport from 'passport'

export default (app) => {
  // USER ROUTES
  app.route('/api/users').post(userSignUp)
  app
    .route('/api/users/me')
    .get(passport.authenticate('jwt', { session: false }), getUserProfile)
  app
    .route('/api/users/me')
    .put(passport.authenticate('jwt', { session: false }), updateUserProfile)
  app
    .route('/api/users/me/image')
    .put(
      passport.authenticate('jwt', { session: false }),
      uploader.single('image'),
      uploadUserImage,
    )
  app
    .route('/api/users/me')
    .delete(passport.authenticate('jwt', { session: false }), deleteUser)

  // SESSION ROUTES
  app.route('/api/session').post(userSignIn)
}
