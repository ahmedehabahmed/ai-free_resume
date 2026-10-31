import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import ParticleBackground from '~/components/ParticleBackground'
import { usePuterStore } from '~/lib/puter'
import { usePuterStore } from '~/lib/puter'
export const meta = ()=> (
[
  { title: "Free AI Resume | Auth" },
  { name: "description", content: "log into your account" }
]
)

const auth = () => {
  const {isLoading, auth} = usePuterStore()
  const location = useLocation()
  const next = location.search.split('=')[1] 
  const navigate = useNavigate()
  useEffect(() => {
    if (auth.isAuthenticated)navigate(next);
      // Handle authenticated state
    
  }, [auth.isAuthenticated , next, navigate]);
  return (
    <main className="interactive-background flex items-center justify-center min-h-screen">
      <ParticleBackground />
      <div className="auth-form gradient-border p-8 shadow-lg">
       <section className='flex flex-col gap-8 bg-white rounded-2xl p-10'>
        <div  className='flex flex-col gap-2 items-center text-center'>
          <h1 className='text-3xl font-bold text-center'>Welcome</h1>
          <h2 className=''>log in to countinue Your job journey</h2>
        </div>
        <div>{ isLoading ? (
              <button className="bg-blue-500 text-white py-2 px-4 rounded-md auth-button animate-pulse" >
                <p>sign in</p>
              </button> ): (
                            <>
                             {auth.isAuthenticated ? (
                <button className='auth-button' onClick={auth.signOut}>
                 <p>Log Out</p>
                </button>
              ) :(
                <button className='auth-button' onClick={auth.signIn}>
                <p>Log In</p>
                </button>
              )}
              </>
              
             
            )}
        </div>
       </section>
      </div>
    </main>
  )
}

export default auth