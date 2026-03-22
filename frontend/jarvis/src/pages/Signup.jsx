import React, { useContext, useState } from "react";
import bg from "../assets/authBg.png";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { userDataContext } from "../context/UserContext";

function SignUp() {

  const { serverUrl, setUserData } = useContext(userDataContext);
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();

    setErr("");
    setLoading(true);

    try {

      let result = await axios.post(
        `${serverUrl}/api/auth/signup`,
        { name, email, password },
        { withCredentials: true }
      );

      setUserData(result.data);
      setLoading(false);

      navigate("/customize");

    } catch (error) {
      console.log(error);
      setUserData(null);
      setLoading(false);
      const msg = error.response?.data?.message
        || (error.code === "ERR_NETWORK" ? "Cannot reach server. Is the backend running on port 5000?" : "Signup failed");
      setErr(msg);
    }
  };

  return (
    <div
      className="w-full h-[100vh] bg-cover flex justify-center items-center"
      style={{ backgroundImage: `url(${bg})` }}
    >

      <form
        onSubmit={handleSignUp}
        className="w-[90%] h-[600px] max-w-[500px] bg-[#00000062] backdrop-blur shadow-lg shadow-black flex flex-col items-center justify-center gap-[20px] px-[20px]"
      >

        <h1 className="text-white text-[30px] font-semibold mb-[30px]">
          Register to <span className="text-blue-400">Virtual Assistant</span>
        </h1>

        {/* NAME */}
        <input
          type="text"
          placeholder="Enter your Name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[18px]"
        />

        {/* EMAIL */}
        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[18px]"
        />

        {/* PASSWORD */}
        <div className="w-full h-[60px] border-2 border-white bg-transparent text-white rounded-full text-[18px] relative">

          <input
            type={showPassword ? "text" : "password"}
            placeholder="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-full rounded-full outline-none bg-transparent placeholder-gray-300 px-[20px] py-[10px]"
          />

          {!showPassword && (
            <IoEye
              className="absolute top-[18px] right-[20px] w-[25px] h-[25px] text-white cursor-pointer"
              onClick={() => setShowPassword(true)}
            />
          )}

          {showPassword && (
            <IoEyeOff
              className="absolute top-[18px] right-[20px] w-[25px] h-[25px] text-white cursor-pointer"
              onClick={() => setShowPassword(false)}
            />
          )}

        </div>

        {/* ERROR */}
        {err.length > 0 && (
          <p className="text-red-500 text-[17px]">{err}</p>
        )}

        {/* BUTTON */}
        <button
          disabled={loading}
          className="min-w-[150px] h-[60px] mt-[30px] text-black font-semibold bg-white rounded-full text-[19px]"
        >
          {loading ? "Loading..." : "Sign Up"}
        </button>

        <p
          className="text-white text-[18px] cursor-pointer"
          onClick={() => navigate("/signin")}
        >
          Already have an account ?{" "}
          <span className="text-blue-400">Sign In</span>
        </p>

      </form>

    </div>
  );
}

export default SignUp;