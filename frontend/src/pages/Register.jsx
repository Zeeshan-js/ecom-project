// Import necessary components and hooks
import { LockClosedIcon } from "@heroicons/react/20/solid"
import { useState } from "react"
import { useAuth } from "../components/AuthContext.jsx"

// Component for user registration
const Register = () => {
  // State to manage user registration data
  const [data, setData] = useState({
    email: "",
    username: "",
    password: ""
  })

  // Access the register function from the authentication context
  const { register } = useAuth()

  // Handle data change for input fields
  const handleDataChange = name => e => {
    // Update the corresponding field in the data state
    setData({
      ...data,
      [name]: e.target.value
    })
  }

  // Handle user registration
  const handleRegister = async () => await register(data)

  return (
    // Register form UI
    <div className="flex justify-center items-center flex-col h-screen w-screen">
      <div className="max-w-5xl w-1/2 p-8 flex justify-center items-center gap-5 flex-col bg-dark shadow-md rounded-2xl my-16 border-secondary border-[1px]">
        <h1 className="inline-flex items-center text-2xl mb-4 flex-col">
          {/* Lock icon */}
          <LockClosedIcon className="h-8 w-8 mb-2" /> Register
        </h1>
        {/* Input fields for username, password, and email */}
        <input
          placeholder="Enter the email..."
          type="email"
          name="email"
          value={data.email}
          onChange={handleDataChange("email")}
        />
        <input
          placeholder="Enter the username..."
          type="text"
          name="username"
          value={data.username}
          onChange={handleDataChange("username")}
        />
        <input
          placeholder="Enter the password..."
          type="password"
          name="password"
          value={data.password}
          onChange={handleDataChange("password")}
        />
        {/* Register button */}
        <button
         className="w-full p-2 border bg-blue-500 rounded-2xl text-white"
         onClick={handleRegister}
        >
            Register
        </button>
        {/* Login link */}
        <small className="text-black">
          Already have an account?{" "}
          <a className="text-primary text-blue-400 hover:underline" href="/login">
            Login
          </a>
        </small>
      </div>
    </div>
  )
}

export default Register