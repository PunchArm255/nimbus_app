import React, { useState } from 'react'
import { motion } from 'framer-motion'
import cloud from '../public/cloud.svg'

const LoginScreen = () => {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleClick = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <motion.div
        className="inline-block"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={isExpanded ? { width: '1000dvh', height: '1000dvh' } : { width: 'auto', height: 'auto' }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
        onClick={handleClick}
      >
        <img src={cloud} alt="Cloud" className="block w-full h-full" />
      </motion.div>
    </div>
  )
}

export default LoginScreen