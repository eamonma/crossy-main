import React from "react"
import { signIn } from "next-auth/react"

const Login = () => {
  return (
    <div>
      <button onClick={() => signIn("discord")}>log in with discord</button>
    </div>
  )
}

export default Login
