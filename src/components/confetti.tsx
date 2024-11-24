"use client"

import { useEffect, useState } from 'react'
import ReactConfetti from 'react-confetti'

export const Confetti = () => {
  const [windowDimension, setWindowDimension] = useState({ width: 0, height: 0 })

  const detectSize = () => {
    setWindowDimension({
      width: window.innerWidth,
      height: window.innerHeight,
    })
  }

  useEffect(() => {
    detectSize()
    window.addEventListener('resize', detectSize)
    return () => {
      window.removeEventListener('resize', detectSize)
    }
  }, [])

  return (
    <ReactConfetti
      width={windowDimension.width}
      height={windowDimension.height}
      recycle={false}
      numberOfPieces={200}
    />
  )
}

