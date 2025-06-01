// Importing necessary components and hooks
import { LockClosedIcon } from "@heroicons/react/20/solid"
import { useState } from "react"
import { useAuth } from "../components/AuthContext.jsx"

// Component for the Login page
const Login = () => {
  // State to manage input data (username and password)
  const [data, setData] = useState({
    username: "",
    password: ""
  })

  // Accessing the login function from the AuthContext
  const { login } = useAuth()

  // Function to update state when input data changes
  const handleDataChange = name => e => {
    setData({
      ...data,
      [name]: e.target.value
    })
  }

  // Function to handle the login process
  const handleLogin = async () => await login(data)

  return (
    <div className="flex justify-center items-center flex-col h-screen w-screen">
      <div className="max-w-5xl w-1/2 p-8 flex justify-center items-center gap-5 flex-col bg-dark shadow-md rounded-2xl my-16 border-secondary border-[1px]">
        <h1 className="inline-flex items-center text-2xl mb-4 flex-col">
          <LockClosedIcon className="h-8 w-8 mb-2" /> Login
        </h1>
        {/* Input for entering the username */}
        <input
          placeholder="Enter the username..."
          name="username"
          value={data.username}
          onChange={handleDataChange("username")}
        />
        {/* Input for entering the password */}
        <input
          placeholder="Enter the password..."
          type="password"
          name="password"
          value={data.password}
          onChange={handleDataChange("password")}
        />
        {/* Button to initiate the login process */}
        <button
          disabled={Object.values(data).some(val => !val)}
          className="w-full text-white border p-2 rounded-2xl bg-blue-600"
          onClick={handleLogin}
        >
          Login
        </button>
        {/* Link to the registration page */}
        <small className="text-black">
          Don&apos;t have an account?{" "}
          <a className="text-primary text-blue-500 hover:underline" href="/register">
            Register
          </a>
        </small>
      </div>
    </div>
  )
}

export default Login