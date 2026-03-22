import uploadOnCloudinary from "../config/cloudinary.js"
import geminiResponse from "../gemini.js"
import User from "../models/user.model.js"
import moment from "moment"


// ================= GET CURRENT USER =================

export const getCurrentUser = async (req, res) => {

  try {

    const userId = req.userId

    const user = await User.findById(userId).select("-password")

    if (!user) {
      return res.status(400).json({ message: "user not found" })
    }

    return res.status(200).json(user)

  } catch (error) {

    return res.status(400).json({ message: "get current user error" })

  }

}


// ================= UPDATE ASSISTANT =================

export const updateAssistant = async (req, res) => {

  try {

    const { assistantName, imageUrl } = req.body

    let assistantImage

    if (req.file) {
      assistantImage = await uploadOnCloudinary(req.file.path)
    } else {
      assistantImage = imageUrl
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        assistantName,
        assistantImage
      },
      { new: true }
    ).select("-password")

    return res.status(200).json(user)

  } catch (error) {

    return res.status(400).json({ message: "update assistant error" })

  }

}


// ================= ASK AI ASSISTANT =================

export const askToAssistant = async (req, res) => {

  try {

    const { command } = req.body

    const user = await User.findById(req.userId)

    const userName = user.name
    const assistantName = user.assistantName

    const result = await geminiResponse(command, assistantName, userName)

    const jsonMatch = result.match(/\{[\s\S]*\}/)

    if (!jsonMatch) {
      return res.status(400).json({
        response: "sorry, i can't understand"
      })
    }

    const gemResult = JSON.parse(jsonMatch[0])
    const type = gemResult.type


    switch (type) {

      // ===== GET DATE =====
      case "get-date":

        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `current date is ${moment().format("YYYY-MM-DD")}`
        })


      // ===== GET TIME =====
      case "get_time":

        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `current time is ${moment().format("HH:mm")}`
        })


      // ===== GET DAY =====
      case "get_day":

        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `today is ${moment().format("dddd")}`
        })


      // ===== GET MONTH =====
      case "get_month":

        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `current month is ${moment().format("MMMM")}`
        })


      // ===== OTHER ACTIONS =====
      default:

        return res.json({
          type,
          userInput: gemResult.userInput,
          response: gemResult.response
        })

    }

  } catch (error) {

    console.log(error)

    return res.status(500).json({
      message: "assistant error"
    })

  }

}