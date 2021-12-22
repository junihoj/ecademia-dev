import axios from "axios";
import { useState } from "react";
import InstructorRoute from "../../../components/routes/InstructorRoute";
import {toast} from 'react-toastify'
import CourseCreateForm from "../../../components/forms/CourseCreateForm";
import Resizer from 'react-image-file-resizer'
import {useRouter}from "next/router";
const CourseCreate= ()=>{

    const router = useRouter()
    //state 
    const [values, setValue]= useState({
        title:'',
        description:'',
        price: '9.99',
        uploading:false,
        paid:true,
        category:'',
        loading:false,
        imagePreview:''
    })
    const [image, setImage]= useState({})
    const [preview, setPreview] = useState('')
    const [uploadButtonText, setUploadButtonText] = useState('Upload Image')

    const handleChange = e=>{
        setValue({...values, [e.target.name]: e.target.value})
    }

    const handleImage =(e)=>{
        let file = e.target.files[0];
        setPreview(window.URL.createObjectURL(file))
        setUploadButtonText(file.name)
        setValue({...values, loading:true})

        //resize
        Resizer.imageFileResizer(file,720,500, "JPEG",100,0, async (uri)=>{
            console.log(uri)
            try {
                //upload image
                let {data} = await axios.post('/api/course/upload-image',{
                    image:uri
                })
                console.log('IMAGE UPLOADED', data)
                //set image in the state
                setImage(data)
                setValue({...values, loading:false})
            } catch (error) {
                console.log(error)
                setValue({...values, loading:false})
                new TransformStream("Image upload failed, Try later.")
                toast("Image upload failed, Try later")
            }
        })

    }

    const handleImageRemove = async (e)=>{
        console.log('REMOVE IMAGE')
        try{
            const res = await axios.post('/api/course/remove-image', {image})

            setImage({})
            setPreview("")
            setUploadButtonText("Upload Image")
            setValue({...values, loading:true})
        }catch(err){
            console.log(err)
            setValue({...values, loading:false})
            toast("Removing Image failed. Try later.")
            
        }
    }
    const handleSubmit = async (e)=>{
        e.preventDefault()
        // console.log(values)
        try{
            const {data} = await axios.post('/api/course', {
                ...values, 
                image,
            })
            toast("Great Now you can start adding Lessons")
            router.push("/instructor")
        }catch(err){
            if(err.response){
                toast(err.response.data);
            }else{
                console.log(err)
                toast(err);

            }
        } 
    }

   
    return(
        <InstructorRoute>
            <h1 
                className="jumbotron text-center square">
                Create Course
            </h1>
            <div className="pt-3 pb-3">
                <CourseCreateForm 
                    handleSubmit={handleSubmit}
                    handleChange={handleChange}
                    handleImage={handleImage}
                    values={values}
                    setValue={setValue}
                    preview={preview}
                    uploadButtonText={uploadButtonText}
                    handleImageRemove={handleImageRemove}
                />
            </div>
            <pre>{JSON.stringify(values,null, 4)}</pre>
            <pre>{JSON.stringify(image, null,4)}</pre>
        </InstructorRoute>
            
    )
}


export default CourseCreate;