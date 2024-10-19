import React, { useState, useRef, DragEvent, useEffect } from 'react'

export interface FileObject {
  name: string
  size: number
  type: string
  objectURL: string // The URL representing the file object
}

interface FileUploadProps {
  defaultFiles?: string[]
  onFilesChange: (files: File[]) => void // Change to accept an array of File
}

const FileUpload: React.FC<FileUploadProps> = ({ defaultFiles = [], onFilesChange }) => {
  const [files, setFiles] = useState<FileObject[]>([]) // Change to use an array
  const hiddenInputRef = useRef<HTMLInputElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const [dragCounter, setDragCounter] = useState(0)

  useEffect(() => {
    if (defaultFiles.length) {
      const initialFiles = defaultFiles.map((url) => {
        const name = url.split('/').pop() || ''
        return {
          name,
          size: 0,
          type: 'image/*',
          objectURL: url
        }
      })
      setFiles(initialFiles)
      onFilesChange(initialFiles.map((file) => new File([], file.name, { type: file.type })))
    }
  }, [defaultFiles])

  const addFile = (file: File) => {
    const objectURL = URL.createObjectURL(file)
    const newFile: FileObject = {
      name: file.name,
      size: file.size,
      type: file.type,
      objectURL
    }

    setFiles((prevFiles) => {
      const updatedFiles = [...prevFiles, newFile]
      onFilesChange([...prevFiles.map((f) => new File([], f.name, { type: f.type })), file])
      return updatedFiles
    })
  }
  const handleDelete = (key: string) => {
    setFiles((prevFiles) => {
      const newFiles = prevFiles.filter((file) => file.objectURL !== key)
      prevFiles.forEach((file) => {
        if (file.objectURL === key) {
          URL.revokeObjectURL(file.objectURL) // Xóa blob URL
        }
      })
      onFilesChange(newFiles.map((fileObj) => new File([], fileObj.name, { type: fileObj.type })))

      return newFiles
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      Array.from(e.target.files).forEach(addFile)
    }
  }

  // Handle file drop
  const handleDrop = (e: DragEvent) => {
    e.preventDefault()
    setDragCounter(0)
    if (e.dataTransfer.files) {
      Array.from(e.dataTransfer.files).forEach(addFile)
    }
    if (overlayRef.current) {
      overlayRef.current.classList.remove('draggedover')
    }
  }

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault()
  }

  const handleDragEnter = (e: DragEvent) => {
    e.preventDefault()
    setDragCounter((prev) => prev + 1)
    if (overlayRef.current) {
      overlayRef.current.classList.add('draggedover')
    }
  }

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault()
    setDragCounter((prev) => prev - 1)
    if (dragCounter <= 1 && overlayRef.current) {
      overlayRef.current.classList.remove('draggedover')
    }
  }

  const handleFileClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    hiddenInputRef.current?.click()
  }

  // const handleDelete = (key: string) => {
  // setFiles((prevFiles) => {
  //   const newFiles = prevFiles.filter((file) => file.objectURL !== key)
  //   onFilesChange(newFiles.map((fileObj) => new File([], fileObj.name, { type: fileObj.type })))
  //   return newFiles
  // })

  // }

  // }

  return (
    <article
      aria-label='File Upload Modal'
      className='relative h-full flex flex-col bg-white shadow-xl rounded-md'
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
    >
      <section className='h-full overflow-auto p-8 flex flex-col'>
        <header className='border-dashed border-2 border-gray-400 py-10 flex flex-col justify-center items-center'>
          <p className='mb-3 font-semibold text-gray-900 flex flex-wrap justify-center'>
            <span>Drag and drop your files anywhere or</span>
          </p>
          <input
            id='hidden-input'
            ref={hiddenInputRef}
            type='file'
            multiple
            className='hidden'
            onChange={handleInputChange}
          />
          <button
            type='button'
            className='mt-2 rounded-sm px-3 py-1 bg-gray-200 hover:bg-gray-300 focus:shadow-outline focus:outline-none'
            onClick={handleFileClick}
          >
            Upload a file
          </button>
        </header>

        <h1 className='pt-8 pb-3 font-semibold sm:text-lg text-gray-900'>To Upload</h1>

        <ul className='flex flex-1 flex-wrap -m-1' id='gallery'>
          {files.length === 0 ? (
            <li className='h-full w-full text-center flex flex-col items-center justify-center'>
              <img
                className='mx-auto w-32'
                src='https://user-images.githubusercontent.com/507615/54591670-ac0a0180-4a65-11e9-846c-e55ffce0fe7b.png'
                alt='no data'
              />
              <span className='text-small text-gray-500'>No files selected</span>
            </li>
          ) : (
            files.map((file, index) => (
              <li
                key={`${file.name}-${file.size}-${index}`}
                className='block p-1 w-1/2 sm:w-1/2 md:w-1/4 lg:w-1/6 xl:w-1/8 h-24'
              >
                <article className='group w-full h-full rounded-md bg-gray-100 cursor-pointer relative shadow-sm'>
                  {file && (
                    <img
                      // src={file.objectURL}
                      src={
                        file.objectURL.startsWith('blob:')
                          ? file.objectURL
                          : `http://localhost:8080/images/${file.objectURL}`
                      }
                      alt={file.name}
                      className='img-preview w-full h-full object-cover rounded-md'
                    />
                  )}
                  <section className='flex flex-col text-xs break-words w-full h-full z-20'>
                    <h1 className='flex-1'>{file.name}</h1>
                    <div className='flex'>
                      <span className='p-1 text-blue-800'>
                        <i>
                          <svg
                            className='fill-current w-4 h-4 ml-auto'
                            xmlns='http://www.w3.org/2000/svg'
                            width='24'
                            height='24'
                            viewBox='0 0 24 24'
                          >
                            <path d='M15 2v5h5v15h-16v-20h11zm1-2h-14v24h20v-18l-6-6z' />
                          </svg>
                        </i>
                      </span>
                      <p className='p-1 size text-xs text-gray-700'>
                        {file.size > 1024
                          ? file.size > 1048576
                            ? `${Math.round(file.size / 1048576)} mb`
                            : `${Math.round(file.size / 1024)} kb`
                          : `${file.size} b`}
                      </p>
                      <button
                        className='delete ml-auto focus:outline-none hover:bg-gray-300 p-1 rounded-md text-gray-800'
                        onClick={() => handleDelete(file.objectURL)}
                      >
                        <svg
                          className='pointer-events-none fill-current w-4 h-4'
                          xmlns='http://www.w3.org/2000/svg'
                          width='24'
                          height='24'
                          viewBox='0 0 24 24'
                        >
                          <path d='M3 6l3 18h12l3-18h-18zm19-4v2h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.316c0 .901.73 2 1.631 2h5.711z' />
                        </svg>
                      </button>
                    </div>
                  </section>
                </article>
              </li>
            ))
          )}
        </ul>
      </section>
    </article>
  )
}

export default FileUpload
