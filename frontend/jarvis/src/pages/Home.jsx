import React, { useContext, useEffect, useRef, useState } from "react"
import { userDataContext } from "../context/UserContext"
import { useNavigate } from "react-router-dom"
import axios from "axios"

function Home() {

  const { userData, serverUrl, setUserData, getGeminiResponse } =
    useContext(userDataContext)

  const navigate = useNavigate()

  const [listening, setListening] = useState(false)
  const [command, setCommand] = useState("")
  const [logs, setLogs] = useState([])

  const recognitionRef = useRef(null)
  const isSpeakingRef = useRef(false)
  const isRecognizingRef = useRef(false)

  const synth = window.speechSynthesis



  // ================= LOGOUT =================

  const handleLogOut = async () => {

    try {

      await axios.get(`${serverUrl}/api/auth/logout`, {
        withCredentials: true
      })

      setUserData(null)
      navigate("/signin")

    } catch (error) {

      setUserData(null)
      console.log(error)

    }

  }



  // ================= START RECOGNITION =================

  const startRecognition = () => {

    const recognition = recognitionRef.current

    if (!recognition) return

    if (!isSpeakingRef.current && !isRecognizingRef.current) {

      try {

        recognition.start()
        console.log("Recognition requested to start")

      } catch (err) {

        if (err.name !== "InvalidStateError") {

          console.error("Start error:", err)

        }

      }

    }

  }



  // ================= SPEAK FUNCTION =================

  const speak = (text) => {

    const utterence = new SpeechSynthesisUtterance(text)

    utterence.lang = "hi-IN"

    const voices = window.speechSynthesis.getVoices()

    const hindiVoice = voices.find(v => v.lang === "hi-IN")

    if (hindiVoice) {
      utterence.voice = hindiVoice
    }

    isSpeakingRef.current = true

    utterence.onend = () => {

      isSpeakingRef.current = false
      startRecognition()

    }

    synth.speak(utterence)

  }



  // ================= HANDLE COMMAND =================

  const handleCommand = (data) => {

    const { type, userInput, response } = data

    speak(response)

    setLogs(prev => [
      ...prev,
      { user: userInput, assistant: response }
    ])


    if (type === "google_search") {

      const query = encodeURIComponent(userInput)

      window.open(
        `https://www.google.com/search?q=${query}`,
        "_blank"
      )

    }


    if (type === "youtube_search" || type === "youtube_play") {

      const query = encodeURIComponent(userInput)

      window.open(
        `https://www.youtube.com/results?search_query=${query}`,
        "_blank"
      )

    }


    if (type === "calculator_open") {

      window.open(
        "https://www.google.com/search?q=calculator",
        "_blank"
      )

    }


    if (type === "instagram_open") {

      window.open(
        "https://www.instagram.com",
        "_blank"
      )

    }


    if (type === "facebook_open") {

      window.open(
        "https://www.facebook.com",
        "_blank"
      )

    }


    if (type === "weather-show") {

      window.open(
        "https://www.google.com/search?q=weather",
        "_blank"
      )

    }


    if (type === "whatsapp_open") {

      window.open(
        "https://web.whatsapp.com",
        "_blank"
      )

    }


    if (type === "telegram_open") {

      window.open(
        "https://web.telegram.org",
        "_blank"
      )

    }


    if (type === "gmail_open") {

      window.open(
        "https://mail.google.com",
        "_blank"
      )

    }


    if (type === "spotify_open") {

      window.open(
        "https://open.spotify.com",
        "_blank"
      )

    }

  }



  // ================= MANUAL COMMAND =================

  const sendCommand = async () => {

    if (!command) return

    const data = await getGeminiResponse(command)

    handleCommand(data)

    setCommand("")

  }



  // ================= SPEECH RECOGNITION =================

  useEffect(() => {

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition

    const recognition = new SpeechRecognition()

    recognition.continuous = true
    recognition.lang = "en-US"

    recognitionRef.current = recognition



    recognition.onstart = () => {

      console.log("Recognition started")

      isRecognizingRef.current = true
      setListening(true)

    }



    recognition.onend = () => {

      console.log("Recognition ended")

      isRecognizingRef.current = false
      setListening(false)

      if (!isSpeakingRef.current) {

        setTimeout(() => {

          startRecognition()

        }, 500)

      }

    }



    recognition.onerror = (event) => {

      console.error("Speech recognition error:", event.error)

    }



    recognition.onresult = async (e) => {

      const transcript =
        e.results[e.results.length - 1][0].transcript.trim()

      console.log("heard :", transcript)


      if (
        transcript
          .toLowerCase()
          .includes(userData?.assistantName?.toLowerCase())
      ) {

        const data = await getGeminiResponse(transcript)

        handleCommand(data)

      }

    }



    startRecognition()



    const fallback = setInterval(() => {

      if (!isSpeakingRef.current && !isRecognizingRef.current) {

        startRecognition()

      }

    }, 3000)



    return () => {

      recognition.stop()

      setListening(false)

      isRecognizingRef.current = false

      clearInterval(fallback)

    }

  }, [])



  return (

    <div className="w-full h-[100vh] bg-gradient-to-t from-black to-[#02023d] flex flex-col items-center justify-center gap-[15px]">

      <button
        className="min-w-[150px] h-[60px] mt-[30px] text-black font-semibold absolute top-[20px] right-[20px] bg-white rounded-full text-[19px]"
        onClick={handleLogOut}
      >
        Log Out
      </button>


      <button
        className="min-w-[150px] h-[60px] mt-[30px] text-black font-semibold bg-white absolute top-[100px] right-[20px] rounded-full text-[19px]"
        onClick={() => navigate("/customize")}
      >
        Customize your Assistant
      </button>


      <div className="w-[300px] h-[400px] flex justify-center items-center overflow-hidden rounded-4xl shadow-lg">

        <img
          src={userData?.assistantImage}
          alt=""
          className="h-full object-cover"
        />

      </div>


      <h1 className="text-white text-[18px] font-semibold">

        I'm {userData?.assistantName}

      </h1>


      <p className="text-white opacity-70">

        {listening ? "Listening..." : "Assistant Ready"}

      </p>



      {/* COMMAND INPUT */}

      <div className="flex gap-2 mt-4">

        <input
          value={command}
          onChange={(e)=>setCommand(e.target.value)}
          placeholder="Type command..."
          className="px-3 py-2 rounded text-black"
        />

        <button
          onClick={sendCommand}
          className="bg-white text-black px-4 py-2 rounded"
        >
          Send
        </button>

      </div>



      {/* CONVERSATION LOG */}

      <div className="text-white mt-4 max-h-[200px] overflow-auto">

        {logs.map((log,index)=>(
          <div key={index}>

            <p>User: {log.user}</p>

            <p>Jarvis: {log.assistant}</p>

          </div>
        ))}

      </div>

    </div>

  )

}

export default Home