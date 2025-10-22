import React from 'react'

interface AuthFormProps{
    type : 'login' | 'signup';
    userRole : 'patient'|'doctor'
}

const AuthForm = ({type, userRole} : AuthFormProps) => {
  return (
    <div>AuthForm</div>
  )
}

export default AuthForm