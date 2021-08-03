import express from "express"
const activityRouter = express.Router()

activityRouter.get("/add/:x?/:y?", (req,res) => {
    const {x,y} = req.params
    if ( !x || !y) {
      res.status(400).json({msg:"Please include two numbers"})
    } else {
    const total = parseInt(x)+ parseInt(y)
    res.status(200).json({sum:total})
    }
  })

activityRouter.get("/hello/:name?", (req,res) =>{
    let {name} =req.params
    if (!name){
      res.status(400).json({msg:"please include name"})
    } else {
    res.status(200).json({msg: `Hello ${name}`})
    }
}) 

activityRouter.get("/teapot", (req,res) => {
    const status = true
    res.status(418).json({msg:status})
})

activityRouter.post("/teapot", (req,res) => {
    let status = ""
    let answer = 0
    const {areYouATeapot} = req.body
    if (areYouATeapot === true){
      answer ="yes"
      status= 418
    } else {
      answer ="No"
      status = 200
    }
    res.status(status).json({msg:`amIATeapot ${answer}`})  
})

module.exports = activityRouter