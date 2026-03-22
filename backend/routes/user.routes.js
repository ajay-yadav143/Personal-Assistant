import express from "express"

import { 
  askToAssistant,
  getCurrentUser,
  updateAssistant
} from "../controllers/user.controller.js"

import isAuth from "../middlewares/isAuth.js"
import upload from "../middlewares/multer.js"

const userRouter = express.Router()


// Get current logged-in user
userRouter.get("/current", isAuth, getCurrentUser)


// Update assistant (name + image)
userRouter.post(
  "/update",
  isAuth,
  upload.single("assistantImage"),
  updateAssistant
)


// Ask AI assistant
userRouter.post(
  "/asktoassistant",
  isAuth,
  askToAssistant
)


export default userRouter