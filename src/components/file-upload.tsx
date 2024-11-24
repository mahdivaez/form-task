"use client"

import { useCallback, useState, useEffect } from "react"
import { useDropzone } from "react-dropzone"
import { ImageIcon, FileIcon, X } from 'lucide-react'
import Image from "next/image"

interface FileUploadProps {
  onFileSelect: (file: File | null) => void
  selectedFile: File | null
  error?: string
}

export function FileUpload({ onFileSelect, selectedFile, error }: FileUploadProps) {
  const [preview, setPreview] = useState<string | null>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles[0]) {
      onFileSelect(acceptedFiles[0])
    }
  }, [onFileSelect])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
      'application/pdf': ['.pdf'],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    maxFiles: 1
  })

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return preview ? (
        <div className="relative  w-10 rounded-full h-10 overflow-hidden ">
          <Image src={preview} alt="Preview" layout="fill" objectFit="cover" />
        </div>
      ) : (
        <ImageIcon className="h-6 w-6 text-gray-400" />
      )
    }
    return <FileIcon className="h-6 w-6 text-gray-400" />
  }

  useEffect(() => {
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(selectedFile)
    } else {
      setPreview(null)
    }
  }, [selectedFile])

  return (
    <div className="w-full text-right">
      <div
        {...getRootProps()}
        className={`w-full border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-primary bg-primary/10' : 'border-gray-300'}
          ${error ? 'border-red-500' : ''}`}
      >
        <input {...getInputProps()} />
        <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          {isDragActive ? 'فایل را رها کنید' : 'انتخاب فایل یا رها کردن فایل در این قسمت'}
        </p>
        <p className="text-xs text-gray-500 mt-1">تصویر (JPEG, PNG, GIF) یا PDF تا حداکثر حجم 5MB</p>
      </div>
  
      {selectedFile && (
        <div className="mt-4 p-2 bg-gray-200 shadow-xl rounded-xl flex items-center justify-between">
          <button
            onClick={(e) => {
              e.preventDefault()
              onFileSelect(null)
              setPreview(null)
            }}
            className="text-gray-500 hover:text-red-500 order-2"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="flex items-center order-1">
            {getFileIcon(selectedFile)}
            <span className="text-sm text-gray-600 mr-2">{selectedFile.name}</span>
          </div>
        </div>
      )}
  
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  )
}

