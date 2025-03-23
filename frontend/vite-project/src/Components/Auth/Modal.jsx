import { useEffect, useState } from "react"
import { AnimatePresence,motion } from "framer-motion"
import { useNavigate } from "react-router-dom"

export default function Modal(){
    const navigate = useNavigate()
    const [showPopup,setShowPopup] = useState(true)
    useEffect(()=>{
        const timer = setTimeout(()=>{
            setShowPopup(false)
        },8000)
        return ()=>clearTimeout(timer)
    },[])
    const popupVariants = {
        hidden: { opacity: 0, y: -50, scale: 0.9 },
        visible: { 
            opacity: 1, 
            y: 0, 
            scale: 1,
            transition: { 
                type: 'spring', 
                stiffness: 400, 
                damping: 25 
            } 
        },
        exit: { 
            opacity: 0, 
            y: -30, 
            scale: 0.9,
            transition: { duration: 0.2 } 
        }
    }

    return(
        <AnimatePresence>
                {showPopup && (
                    <motion.div 
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div 
                            className="bg-white rounded-xl shadow-2xl max-w-md p-6 border border-amber-200"
                            variants={popupVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center">
                                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-amber-300 to-amber-600 flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="ml-3 text-lg font-semibold text-gray-800">Welcome to Morocco Guide</h3>
                                </div>
                                <button 
                                    onClick={() => setShowPopup(false)}
                                    className="text-gray-400 hover:text-gray-500"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 " viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                            
                            <div className="mb-5">
                                <p className="text-gray-600 mb-4">
                                    To access our AI-powered Morocco travel assistant, please log in or create an account.
                                </p>
                                <div className="bg-amber-50 border-l-4 border-amber-500 p-3 rounded">
                                    <p className="text-sm text-amber-800">
                                        Our intelligent guide can help you discover Morocco's hidden gems, traditional cuisine, cultural experiences, and more.
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex justify-end gap-3">
                                <motion.button
                                    onClick={() => navigate('/signup')}
                                    className="px-4 py-2 text-amber-600 hover:text-amber-700 font-medium"
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                >
                                    Create Account
                                </motion.button>
                                <motion.button
                                    onClick={() => setShowPopup(false)}
                                    className="px-4 py-2 bg-gradient-to-r from-amber-300 to-amber-600 text-white rounded-lg font-medium hover:from-amber-400 hover:to-amber-600"
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                >
                                    Continue to Login
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
    )
}