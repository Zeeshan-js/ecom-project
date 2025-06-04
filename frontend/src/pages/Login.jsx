// Importing necessary components and hooks
import { useState } from "react"
import { useAuth } from "../components/AuthContext.jsx"

// Component for the Login page
function Login() {
  const [data, setData] = useState({
    username: "",
    password: "",
  })

  const { login } = useAuth()

  const handleChange = (name) => (e) => {
    setData({ ...data, [name]: e.target.value })
  }


  const handleSubmit = async () => await login(data)
  



  return (
    <div className="h-screen flex items-center justify-center p-6">
      <div className="w-full h-1/2 max-w-sm border rounded-3xl p-4">
        <h2 className="text-center font-bold mb-4 text-2xl">Login</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input
              className="w-full border rounded-lg focus:ring focus:ring-blue-600 p-3 pl-12"
              name='username'
              value={data.username}
              onChange={handleChange("email")}
              placeholder="username"
              type="username"
            />
          </div>

          <div className="relative">
            <input
              className="w-full border rounded-lg focus:ring focus:ring-blue-600 p-3 pl-12"
              value={data.password}
              onChange={handleChange("password")}
              placeholder="Password"
              type="password"
            />
          </div>

          <button className="w-full border rounded-lg p-2 text-white cursor-pointer bg-blue-500 hover:bg-blue-600 transition">Login</button>
        </form>
        <p className="text-sm mt-5 text-center">Don't have an account <a href='/register' className="text-blue-600 underline">sign up</a> here</p>
      </div>
    </div>
  );
}

export default Login