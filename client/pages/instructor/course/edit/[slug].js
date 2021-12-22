import axios from "axios";
import { useState, useEffect } from "react";
import InstructorRoute from "../../../../components/routes/InstructorRoute";
import {toast} from 'react-toastify'
import CourseCreateForm from "../../../../components/forms/CourseCreateForm";
import Resizer from 'react-image-file-resizer'
import {useRouter}from "next/router";
import {List, Avatar, Modal} from 'antd'
import {DeleteOutlined} from '@ant-design/icons'
import UpdateLessonForm from "../../../../components/forms/UpdateLessonForm";

const {Item} = List
const CourseEdit= ()=>{

    const router = useRouter()
    const {slug} = router.query
    // return(<h1>c</h1>)
    useEffect(()=>{
        loadCourse()
    },[slug])

    const loadCourse = async ()=>{
        const {data} = await axios.get(`/api/course/${slug}`)
        if(data){
            setValue(data)
        }
        if(data && data.image){
            setImage(data.image)
        }
    }
    //state 
    const [values, setValue]= useState({
        title:'',
        description:'',
        price: '9.99',
        uploading:false,
        paid:true,
        category:'',
        loading:false,
        imagePreview:'',
        lessons:[]
    })
    const [image, setImage]= useState({})
    const [preview, setPreview] = useState('')
    const [uploadButtonText, setUploadButtonText] = useState('Upload Image')
    // state for lesson update

    const [visible, setVisible] = useState(false)
    const [current, setCurrent]= useState({})
    const [uploadVideoButtonText, setUploadVideoButtonText] = useState('Upload Video')
    const [progress, setProgress] = useState(0)
    const [uploading, setUploading] = useState(false)
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
                new TransformStream("Image upload failed, Tyr later.")
                toast("Image upload failed, Try later")
            }
        })

    }

    const handleSubmit = async (e)=>{
        e.preventDefault()
        // console.log(values)
        try{
            const {data} = await axios.put(`/api/course/${slug}`, {
                ...values, 
                image,
            })
            toast("COURSE UPDATED")
            // router.push("/instructor")
        }catch(err){
            console.log(err)
            console.log(err.response.data)
            toast("Course Update Failed")
        } 
    }

    const handleDrag = (e, index)=>{
        // console.log('ON Drag=>', index)
        e.dataTransfer.setData("itemIndex", index)
    }

    const handleDrop = async (e, index)=>{
        // console.log("ON DROP =>", index)
        const movingItemIndex = e.dataTransfer.getData("itemIndex")
        const targetItemIndex = index;
        let allLessons = values.lessons;

        let movingItem = allLessons[movingItemIndex];
        allLessons.splice(movingItemIndex, 1)
        allLessons.splice(targetItemIndex, 0, movingItem)

        setValue({...values, lessons:[...allLessons]})

        const {data} = await axios.put(`/api/course/${slug}`, {
            ...values, 
            image,
        })

        toast("Lessons rearrange successfully")
    }

    const handleDelete = async (index)=>{
        const answer = window.confirm("Are you sure you want to delete")
        if(!answer) return;

        let allLessons = values.lessons
        const removed = allLessons.splice(index, 1)
        setValue({...values, lessons:allLessons})

        //send request to server

        const {data}= await axios.put(`/api/course/${slug}/${removed[0]._id}`)
        console.log('LESSON DELETED =>', data)
    }

    /**
     * Lesson update functions
     */

    const handleVideo= async (e)=>{
        //remove the previous video
        if(current.video && current.video.Location){
            const res = await axios.post(`/api/course/remove-video/${values.instructor._id}`, current.video)
            console.log("Video Deleted Response", res)
        }

        const file = e.target.files[0]
        
        setUploadVideoButtonText(file.name)
        setUploading(true)
        // send video as form data for uploading

        const videoData = new FormData()
        videoData.append('video', file)
        videoData.append('courseId', values._id)

        //save progress bar and send video form data to backend
        console.log('VIDEO DATA===>', videoData)
        const {data} = await axios.post(
            `/api/course/video-upload/${values.instructor._id}`, 
            videoData, 
            {
                onUploadProgress: (e)=>setProgress(Math.round(100 * e.loaded)/e.total)
            }
        )

        console.log(data)
        setCurrent({...current, video:data})
        setUploading(false)
    }

    const handleUpdateLesson = async (e)=>{
        // console.log("handle update lesson")
        e.preventDefault()
        const {data}  = await axios.put(
            `/api/course/lesson/${slug}/${current._id}`,
            current
        )
        setUploadVideoButtonText('Upload Video')
        setVisible(false)
        toast("Lesson updated")
        setCurrent(data)

        if(data.ok){
            let arr = values.lessons
            const index= arr.findIndex((el)=>el._id=== current._id)

            arr[index] = current
            setValue({...values, lessons:arr})
        }
    }
   
    return(
        <InstructorRoute>
            <h1 
                className="jumbotron text-center square">
                Create Course
            </h1>
            {JSON.stringify(values)}
            <div className="pt-3 pb-3">
                <CourseCreateForm 
                    handleSubmit={handleSubmit}
                    handleChange={handleChange}
                    handleImage={handleImage}
                    values={values}
                    setValue={setValue}
                    preview={preview}
                    uploadButtonText={uploadButtonText}
                    editPage={true}
                />
            </div>


            <div className="row pb-5">
            <div className="col lesson-list">
    <h4>{values && values.lessons && values.lessons.length} Lessons</h4>

                <List
                    onDragOver={e=>e.preventDefault()}
                    itemLayout="horizontal" 
                    dataSource={values && values.lessons} 
                    renderItem={(item, index)=>(
                        <Item
                            draggable
                            onDragStart={e=> handleDrag(e,index)}
                            onDrop={e=>handleDrop(e,index)}
                        >
                            <Item.Meta
                                onClick={()=>{
                                    setVisible(true)
                                    setCurrent(item);
                                }} 
                                avatar={<Avatar>{index + 1}</Avatar>} title={item.title}>
                            </Item.Meta>
                            
                            <DeleteOutlined 
                                onClick={()=> handleDelete(index) }
                                className="text-danger float-end"
                            />
                        </Item>
                )}>
                
                </List>
            </div>
       
       </div>
    
        <Modal 
            title="Update Lesson" 
            centered visible={visible}
            onCancel={()=>setVisible(false)}
            footer={null}
        >
            <UpdateLessonForm 
                current={current}
                setCurrent={setCurrent}
                handleVideo={handleVideo}
                handleUpdateLesson= {handleUpdateLesson}
                uploadVideoButtonText= {uploadVideoButtonText}
                progress = {progress}
                uploading= {uploading}
            />
            <pre>{JSON.stringify(current,null,4)}</pre>
        </Modal>


            <pre>{JSON.stringify(values,null, 4)}</pre>
            <pre>{JSON.stringify(image, null,4)}</pre>
        </InstructorRoute>
            
    )
}


export default CourseEdit;