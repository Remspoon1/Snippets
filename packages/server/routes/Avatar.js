import express from 'express'
import upload from "../middleware/upload"

const avatarRouter = express.Router()

avatarRouter.post ("/upload" ,upload.single('avatar'), async (req,res) => {
   res.status(200).json({img:"/" + req.file.filename})    
})

module.exports = avatarRouter