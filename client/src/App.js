import React from 'react'
import { useState } from 'react'
import logo from './logo.svg'
import './App.css'
import './styles/index.css'
import './styles/tailwind.css'
import useDebounce from './hooks/useDebounce'

const InputLabel = ({ userName }) => {
  // Input Background
  const inputBgOk = 'bg-blue-100 focus:bg-blue-200'
  const inputBgEditing = 'bg-green-100 focus:bg-green-200'
  const inputBgError = 'bg-red-300 focus:bg-red-400'
  const [inputBg, setInputBg] = useState(inputBgOk)

  // Internal name
  const [name, setName] = useState(userName)
  const debouncedName = useDebounce(name, 1000)

  return (
    <div>
      <input
        className={`float-right w-full p-1 my-2 text-gray-600 focus:text-gray-800 ${inputBg} border-transparent outline-none rounded-lg`}
        onChange={e => {
          setName(e.target.value)
          setInputBg(inputBgEditing)
        }}
        value={name}
      />
    </div>
  )
}

function App () {
  return <InputLabel userName='dragon sword'></InputLabel>
}

export default App
