// Import necessary libraries and types
import React from "react"
import { Navigate } from "react-router-dom"
import { useAuth } from "./AuthContext.jsx"

const PublicRoute = ({ children }) => {
  const { token, user } = useAuth()

  if (token && user?._id) return <Navigate to="/landingPage" replace />


  return children
}

export default PublicRoute