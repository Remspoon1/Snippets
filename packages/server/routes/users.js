import express from 'express'
import bcrypt from 'bcryptjs'
import { User } from '../models'
const requireAuth = require("../middleware/requireAuth")

const router = express.Router()

router
  .route('/:id')
  .get(async (request, response) => {
    const populateQuery = [
      {
        path: 'posts',
        populate: { path: 'author', select: ['username', 'profile_image'] },
      },
    ]

    const user = await User.findOne({ username: request.params.id })
      .populate(populateQuery)
      .exec()
    if (user) {
      response.json(user.toJSON())
    } else {
      response.status(404).end()
    }
  })
  .put(requireAuth, async (request, response) => {
    const { password } = request.body
    const { profileImage } = request.body
    const { currentPassword } = request.body
    let {email} = request.body
    const { id } = request.params
    const {user} = request

    if (password.length < 8 || password.length > 20) {
      return response.status(400).json({error: "Must be 8-20 characters"})
    }

    const hashedpassword = await bcrypt.hash(password, 12)
    const match = await bcrypt.compare( currentPassword , user.passwordHash )

    if (!match) return response.status(401).json({error:"Passwords do not match"})
    
    try {
      const userUpdate = await User.findByIdAndUpdate(
        {
          _id: id,
        },
        {
          passwordHash: hashedpassword,
        },
        {
          profile_image: profileImage,
        },
        }
          email: email,
        },
        {
          new: true,
        }
      )

      response.json(userUpdate.toJSON())
    } catch (error) {
      response.status(404).end()
    }
  })

module.exports = router
