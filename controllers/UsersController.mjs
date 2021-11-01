import isEmpty from 'lodash.isempty'
import argon from 'argon2'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import userSignUpSchema from '../middleware/validation/UserSignUpSchema.mjs'
import userSignInSchema from '../middleware/validation/UserSignInSchema.mjs'
import UserUpdateSchema from '../middleware/validation/UserUpdateSchema.mjs'
import User from '../models/User'
import { jwtConfig } from '../config/jwt-config'

async function userSignUp(req, res) {
  const validationResult = userSignUpSchema.validate(req.body)
  if (isEmpty(req.body)) {
    res.status(404)
    res.json({
      code: 'BAD_REQUEST_ERROR',
      errors: [
        {
          key: 'body',
          message: 'request body is empty',
        },
      ],
    })
  } else if (!validationResult.error) {
    const data = { ...req.body }
    const salt = crypto.randomBytes(16)
    const hash = await argon.hash(req.body.password, salt)
    data.password = hash
    let user = await User.findOne({ where: { login: data.login } })
    if (user) {
      res.status(404)
      return res.json({
        code: 'BAD_REQUEST_ERROR',
        errors: [
          {
            key: 'body',
            message: 'user already exist',
          },
        ],
      })
    }
    await User.create(data)
    user = await User.findOne({ where: { login: data.login } })
    const token = jwt.sign(
      {
        login: user.login,
        userId: user.id,
      },
      jwtConfig,
      { expiresIn: 3600 },
    )

    res.json({
      token: `Bearer ${token}`,
    })
  } else {
    res.status(404)
    res.json({
      code: 'BAD_REQUEST_ERROR',
      errors: validationResult.error.details,
    })
  }
}

async function userSignIn(req, res) {
  const validationResult = userSignInSchema.validate(req.body)
  if (isEmpty(req.body)) {
    res.status(404)
    res.json({
      code: 'BAD_REQUEST_ERROR',
      errors: [
        {
          key: 'body',
          message: 'request body is empty',
        },
      ],
    })
  } else if (!validationResult.error) {
    let user = await User.findOne({ where: { login: req.body.login } })
    if (!user) {
      res.status(404)
      return res.json({
        code: 'BAD_REQUEST_ERROR',
        errors: 'user not found',
      })
    }

    const passwordIsMatch = await argon.verify(user.password, req.body.password)
    if (!passwordIsMatch) {
      res.status(404)
      return res.json({
        code: 'BAD_REQUEST_ERROR',
        errors: 'wrong password',
      })
    }

    const token = jwt.sign(
      {
        login: user.login,
        userId: user.id,
      },
      jwtConfig,
      { expiresIn: 3600 },
    )

    res.json({
      token: `Bearer ${token}`,
    })
  } else {
    res.status(404)
    res.json({
      code: 'BAD_REQUEST_ERROR',
      errors: validationResult.error.details,
    })
  }
}

async function getUserProfile(req, res) {
  const user = await User.findByPk(req.user.id, {
    attributes: { exclude: ['password'] },
  })
  if (!user) {
    res.status(404)
    res.json({
      code: 'BAD_REQUEST_ERROR',
      errors: 'user not found',
    })
  }
  res.status(200)
  res.json({
    user,
  })
}

async function updateUserProfile(req, res) {
  //validate data
  const validationResult = UserUpdateSchema.validate(req.body)
  if (isEmpty(req.body)) {
    res.status(404)
    res.json({
      code: 'BAD_REQUEST_ERROR',
      errors: [
        {
          key: 'body',
          message: 'request body is empty',
        },
      ],
    })
    //if validation success update user entity
  } else if (!validationResult.error) {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] },
    })
    await user.update({
      patronymic: req.body.patronymic,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    })
    res.status(200)
    res.json({
      user,
    })
  } else {
    res.status(404)
    res.json({
      code: 'BAD_REQUEST_ERROR',
      errors: validationResult.error.details,
    })
  }
}

async function uploadUserImage(req, res) {
  const user = await User.findByPk(req.user.id, {
    attributes: { exclude: ['password'] },
  })
  if (!user) {
    res.status(404)
    res.json({
      code: 'BAD_REQUEST_ERROR',
      errors: 'USER_NOT_FOUND',
    })
  }
  await user.update({
    imageSrc: req.file ? req.file.path : '',
  })
  res.status(201).json(user)
}

async function deleteUser(req, res) {
  const user = await User.findByPk(req.user.id)
  if (!user) {
    res.status(404)
    res.json({
      code: 'BAD_REQUEST_ERROR',
      errors: 'USER_NOT_FOUND',
    })
  }
  await user.destroy()
  res.status(204)
  console.log('user has been deleted')
  res.json({
    code: 'NO_CONTENT',
  })
}

export {
  userSignUp,
  userSignIn,
  getUserProfile,
  updateUserProfile,
  uploadUserImage,
  deleteUser,
}
