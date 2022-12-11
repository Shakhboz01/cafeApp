import React,{useState} from 'react'
import axios from 'axios'
const Upload = () => {
    const [path,setPath] = useState('')
    const sub = async(e) => {
        e.preventDefault()
        await axios.post('http://localhost:5000/test',{file: path}).then(res=>console.log(res.data))
    }
  return (
    <div>
      <button style={{marginTop:'100px'}}></button>
      <form action="http://localhost:5000/upload" method="POST" enctype="multipart/form-data">
        <input type="file" name="image" />
        <button type="submit">Upload</button>
      </form>
    </div>
  )
}

export default Upload
