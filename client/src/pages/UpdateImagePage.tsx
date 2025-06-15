import { useEffect, useState, type ChangeEvent } from 'react'
import { useParams } from 'react-router-dom'
import { type StudentsType } from '../types/index.types'
import axios from 'axios'
import CustomInput from '../components/common/CustomInput'

function UpdateImagePage() {
  const prams = useParams()
  const [isStudentData, setIsStudentData] = useState<StudentsType>()
  const [isStudentInput, setIsStudentsInput] = useState()
  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setIsStudentsInput((prev: any) => ({
      ...prev,
      [name]: value,
    }))
  }
  const FetchStudent = async () => {
    try {
      const response = await axios.get(`/api/getStudent/${prams.id}`)
      setIsStudentData(response.data)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    FetchStudent()
  }, [])
  const updateProfilePhotoButton = async () => {
    try {
      const response = await axios.put(
        `/api/updateStudent/${prams.id}`,
        isStudentInput,
      )
      console.log(response.data)
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div>
      <div className=' flex justify-between'>
        <CustomInput
          label='Change Image'
          name='studentsProfile'
          onChange={handleOnChange}
        />
        <div>
          <button onClick={updateProfilePhotoButton}> click</button>
        </div>
      </div>
      update image link {isStudentData?.studentName}
    </div>
  )
}

export default UpdateImagePage
