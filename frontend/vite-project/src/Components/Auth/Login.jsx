import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from './AuthProvider'
import { motion } from 'framer-motion'
import Modal from './Modal'

const globalInputsDesign = "border border-gray-300 p-3 mb-2 rounded-lg focus:ring-2 focus:ring-gray-200 focus:border-gray-200 transition-all outline-none"
export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    
    const { login, error, loading } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        const result = await login(email, password)
        if (result.success) {
            navigate('/chat')
        }
    }
    
    //for animations : 
    const container = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.7,
                when: 'beforeChildren',
                staggerChildren: 0.1
            }
        },
        exit: {
            opacity: 0,
            y: -20,
            transition: { duration: 0.3 }
        }
    }

    const buttonVaraints = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 300 } },
        hover: {
            scale: 1.05,
            boxShadow: '0px 5px 10px rgba(0,0,0,0.1)'
        },
        tap: { scale: 0.95 }
    }

    return (
        <div className='flex flex-col justify-center items-center min-h-screen p-4'>
            <Modal/>
            <motion.div className='p-6 backdrop-blur-md rounded-xl shadow-2xl bg-white'
                variants={container}
                initial='hidden'
                animate='visible'
                exit='exit'>
                <div className=''>
                    <div className='text-center'>
                        <h2 className='text-2xl font-bold text-gray-600'>Welcome to <span className="bg-gradient-to-r from-amber-300 to-amber-600 bg-clip-text text-transparent">MoroccoGuide</span></h2>
                        <p className='text-gray-600 mt-2 text-sm'>Login to begin your Moroccan adventure</p>
                    </div>
                    <div className='flex items-center justify-between p-2'>
                        <div className='h-0.5 w-14 bg-gray-300 mt-2 self-start'></div>
                        <div className='h-0.5 w-14 bg-gray-300 mt-2 self-end'></div>
                    </div>
                </div>
                {error && <p className='text-xs text-red-500 text-center mb-2'>{error}</p>}
                <form className='space-y-4' onSubmit={handleSubmit}>
                    <div className='flex flex-col p-4'>
                        <input type="email"
                            placeholder='Email Adress'
                            required
                            className={globalInputsDesign}
                            onChange={(e) => setEmail(e.target.value)}
                            value={email} />
                        <input type="password"
                            placeholder='Password'
                            required
                            className={globalInputsDesign}
                            onChange={(e) => setPassword(e.target.value)}
                            value={password} />

                        <motion.button type='submit'
                            className='mt-6 bg-gradient-to-r from-amber-300 to-amber-600 rounded-2xl p-3 text-white font-medium hover:from-amber-400 hover:to-amber-600 transition-all transform hover:scale-105'
                            disabled={loading}
                            variants={buttonVaraints}
                            whileHover='hover'
                            whileTap='tap'>
                            {loading ? (
                                <motion.div className='flex items-center justify-center'
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}>
                                    <motion.div
                                        className='h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2'
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                    ></motion.div>
                                    Logging In
                                </motion.div>
                            ) : 'Log In'}
                        </motion.button>
                    <p className='text-center pt-3 mt-2'>Don't have an account? <span className='bg-gradient-to-r from-amber-300 to-amber-600 bg-clip-text text-transparent'><Link to='/signup'>Sign up</Link></span></p>
                </div>
            </form>

        </motion.div>
        </div >
    )
}
