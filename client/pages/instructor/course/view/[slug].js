import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import InstructorRoute from "../../../../components/routes/InstructorRoute";
import axios from 'axios'
import {Avatar, 
    Tooltip, 
    Button, 
    Modal,
    List
} from "antd";
import {
    EditOutlined, 
    CheckOutlined, 
    UploadOutlined, 
    QuestionCircleOutlined,
    CloseOutlined
} from '@ant-design/icons'

import ReactMarkdown from 'react-markdown'
import AddLessonForm from "../../../../components/forms/AddLessonForm";
import { toast } from "react-toastify";
import Item from "antd/lib/list/Item";


const CourseView = ()=>{
    const [course, setCourse] = useState({})
    // for lessons modal
    const [visible, setVisible] = useState(false)
    const [values, setValues]= useState({
        title:"",
        content:"",
        video: "",
    })

    const [uploading, setUploading] = useState(false)
    const [uploadButtonText, setUploadButtonText] = useState("Upload Video")
    const [progress, setProgress] = useState(0)
    const router = useRouter()

    const {slug} = router.query

    useEffect(()=>{
        loadCourse()
    },[slug])

    const loadCourse = async ()=>{
        const {data}  = await axios.get(`/api/course/${slug}`)
        setCourse(data)   
    }

    //Functions for add lessons
    const handleAddLesson = async (e)=>{
        e.preventDefault()
        try{
            console.log(values)
            const {data} = await axios.post(
                `/api/course/lesson/${slug}/${course.instructor._id}`,
                 values
            )
            setValues({...values, title:'', content:'', video:{}})
            setProgress(0)
            setUploadButtonText("Upload Video")
            setVisible(false)
            setCourse(data)
            
            toast("Lesson added")
        }catch(err){
            console.log(err)
            toast("lesson add failed")
        }
    }

    const handleVideo =  async (e)=> {
        
        // console.log("handle Video Upload")

        try{
            const file = e.target.files[0]
            setUploadButtonText(file.name)
            setUploading(true)
            const videoData = new FormData()
            videoData.append('video', file)

            //save progress bar and send video as form data to backend
            const {data} = await axios.post(`/api/course/video-upload/${course.instructor._id}`, videoData, {
                onUploadProgress:(e)=>{
                    setProgress(Math.round((100 * e.loaded) / e.total))
                }
            })

            //once response is received 
            console.log(data)
            setValues({...values, video:data})
            setUploading(false)
        }catch(err){
            console.log(err)
            setUploading(false)
            toast("Video Upload Failed")
        }
    }

    const handleVideoRemove = async (e)=>{
        // console.log('handle remove video')

        try{
            setUploading(true)
            const {data} = await axios.post(`/api/course/remove-video/${course.instructor._id}`, values.video)
            console.log({data})
            setValues({...values, video:{}})
            setUploading(false)
            setUploadButtonText("Upload another video")
        }catch(err){
            console.log(err)
            setUploading(false)
            toast("Video remove failed")
        }
    }
    const handleUnpublish = async (e, courseId)=>{
        try{
            let answer = window.confirm(
                "Once you unpublish your course, it will not be available for users to enroll"
            )
            if(!answer) return

            const {data} = await axios.put(`/api/course/unpublish/${courseId}`)
            setCourse(data)
            toast("Your course is Unpublished")
        }catch(err){
            toast ("Your course is unpublish")
        }

    }

    const handlePublish = async (e, courseId)=>{
        try{
            let answer= window.confirm(
                'Once you publish your course it will be life in the market place for user to enroll'
            )
            if(!answer) return
            const {data} = await axios.put(`/api/course/publish/${courseId}`)
            setCourse(data)

            toast("Congrats! Your course is now live")
        }catch(err){
            console.log(err)
            toast("course publish failed. Try again")
        }
    }
    return (
        <InstructorRoute>
            <div className="container-fluid mt-lg-3">
                <h1>{slug}</h1>
    {/*<pre>{JSON.stringify(course, null, 4)}</pre>*/}
            </div>

            <div class="container-fluid pt-3">
                {course && (<div className="container-fluid pt-1">
                    <div className="d-flex pt-2">
                        <Avatar 
                            size={80} 
                            src={course.image? course.image.Location : '/course.png'}
                        />

                        <div className="media-body pl-2">
                            <div className="row justify-content-end">
                                <div className="col">
                                    <h5 className="mt-2 text-primary"> {course.title}</h5>
                                    <p style={{marginTop:"-10px"}}>{course.lessons && course.lessons.length} Lessons</p>
                                    <p style={{marginTop:"-15px", fontSize:"10px"}}>{course.category}</p>
                                </div>

                                <div className="d-flex col">
                                    <Tooltip title="Edit">
                                        <EditOutlined 
                                            className="h5 pointer text-warning mr-4" 
                                            onClick={()=>router.push(`/instructor/course/edit/${slug}`)}
                                        />
                                    </Tooltip>
                                    {
                                        course.lessons && course.lessons.length < 5 ? (
                                            <Tooltip title="Minimum 5 lessons required to Publish">
                                                <QuestionCircleOutlined className="h5 pointer-event text-danger" />
                                            </Tooltip>
                                        ) : course.published ? (
                                            <Tooltip title="Unpublish" className="h5 pointer-event text-danger" >
                                                <CloseOutlined onClick={(e)=>handleUnpublish(e,course._id)}/>
                                            </Tooltip>
                                            ):(
                                            <Tooltip title="Publish" className="h5 pointer-event text-success" >
                                                <CheckOutlined onClick={(e)=>handlePublish(e,course._id)}/>
                                            </Tooltip>
                                            )
                                        
                                    }
                                    
                                </div>
                            </div>
                        </div>
                    </div>

                   <div className="row">
                    <div className="col">
                        <ReactMarkdown children={course.description} />
                    </div>
                   </div>

                   <div className="row">
                        <Button 
                            onClick={()=>setVisible(true)}
                            className="col-md-6 offset-md-3 text-center"
                            type="primary"
                            shape="round"
                            icon={<UploadOutlined />}
                            size="large"
                        >
                            Add Lesson
                        </Button>
                   </div>

                    <Modal 
                        title=" + Add lessson"
                        centered
                        visible={visible}
                        onCancel={()=>setVisible(false)}
                        footer={null}
                    >
                        <AddLessonForm 
                            values={values}
                            setValues={setValues}
                            handleAddLesson={handleAddLesson}
                            uploading={uploading}
                            uploadButtonText = {uploadButtonText}
                            handleVideo={handleVideo}
                            progress={progress}
                            handleVideoRemove={handleVideoRemove}
                        />
                   </Modal>

                   <div className="row pb-5">
                        <div className="col lesson-list">
                            <h4>{course && course.lessons && course.lessons.length} Lessons</h4>

                            <List itemLayout="horizontal" dataSource={course && course.lessons} renderItem={(item, index)=>(
                                <Item>
                                    <Item.Meta avatar={<Avatar>{index + 1}</Avatar>} title={item.title}>
                                    </Item.Meta> 
                                </Item>
                            )}>
                            
                            </List>
                        </div>
                   
                   </div>
                
                </div>
                
                )}
            </div>
        </InstructorRoute>
    )
}

export default CourseView