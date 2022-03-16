import { useState, useEffect, createElement } from "react"
import { useRouter } from "next/router"
import axios from "axios"
import StudentRoute from "../../../components/routes/StudentRoute"
import {Button, Menu, Avatar, } from 'antd'
import ReactPlayer from 'react-player'
import ReactMarkdown from 'react-markdown'
import { CheckCircleFilled, MenuFoldOutlined, MinusCircleFilled, PlayCircleOutlined } from "@ant-design/icons"

const {Item} = Menu

const SingleCourse = ()=>{

    const router = useRouter()

    const [clicked, setClicked] = useState(-1)
    const [collapsed, setCollapsed] = useState(false)
    const [loading, setLoading] = useState(false)
    const [course, setCourse] = useState({lessons:[]})
    const [completedLessons, setCompletedLessons] = useState([]);
    //to force state update

    const [updateState, setUpdateState] = useState(false)


    const {slug} = router.query
    useEffect(()=>{
        if(slug) loadCourse();
    },[slug])

    useEffect(()=>{
        if(course._id) loadCompletedLessons();
    },[course])

    


    const loadCourse = async ()=>{
        try {
            const {data} = await axios.get(`/api/user/course/${slug}`);
            setCourse(data)
        } catch (error) {
            console.log(error)
        }
        
    }

    const loadCompletedLessons =async ()=>{
        const {data} = await axios.post(`/api/list-completed`, {
            courseId: course._id
        })
        console.log('COMPLETED LESSONS', data)

        setCompletedLessons(data);
    }

    const markCompleted = async ()=>{
        const {data} = await axios.post(`/api/mark-completed`, {
            courseId:course._id,
            lessonId:course.lessons[clicked]._id,
        })
        setCompletedLessons([...completedLessons, course.lessons[clicked]._id])
    }

    const markIncompleted = async ()=>{
        try{
            const {data} = await axios.post(`/api/mark-incomplete`, {
                courseId:course._id,
                lessonId:course.lessons[clicked]._id,
            })
    
            console.log(data)
    
            const all = completedLessons;
            const index = all.indexOf(course.lessons[clicked]._id) //true or -1
    
            if(index > -1){
                all.splice(index, 1)
                setCompletedLessons(all)
                setUpdateState(!updateState)
            }
        }catch(err){
            console.log(err)
        }
    }
    return(
        <StudentRoute>
            <h1 className="mt-5"></h1>
            {/* <h1 className="mt-lg-5">Course slug is {JSON.stringify(course)}</h1> */}
            <div className="row">
                <div style={{maxWidth:320}}>
                    <Button 
                        className="text-primary mt-1 mb-2 btn-block"
                        onClick={()=> setCollapsed(!collapsed)}
                    >
                        {createElement(collapsed? MenuFoldOutlined: MenuFoldOutlined)} 
                        {!collapsed && 'Lessons'}
                    </Button>
                    <Menu 
                        defaultSelectedKeys={[clicked]}
                        inlineCollapsed={collapsed}
                        style={{height:'80vh', overflow:'scroll'}}
                    >
                        {course.lessons.map((lesson, index)=>(
                            <Item 
                                onClick={()=>setClicked(index)} 
                                key={index} 
                                icon={<Avatar>{index + 1}</Avatar>}
                            >
                                {lesson.title.substring(0, 30)} {completedLessons.includes(lesson._id) ? (
                                    <CheckCircleFilled className="float-end text-primary ml-3" 
                                    style={{marginTop: "13px"}}
                                    />
                                ):(
                                    <MinusCircleFilled className="float-end text-danger ml-3" 
                                    style={{marginTop: "13px"}}
                                    />
                                )}

                            </Item>
                        ))}
                    </Menu>
                </div>

                <div className="col">
                    {clicked !== -1 ? (
                        <>
                            <div className="col alert alert-primary square">
                                <b>{course.lessons[clicked].title.substring(0,30)}</b>
                                {completedLessons.includes(course.lessons[clicked]._id)? (
                                    <span className="float-end pointer" onClick={markIncompleted}>
                                        Mark as Incompleted
                                    </span>
                                ):(
                                    <span className="float-end pointer" onClick={markCompleted}>
                                        Mark as completed
                                    </span>
                                )}
                            </div>
                            {
                                course.lessons[clicked].video && course.lessons[clicked].video.Location &&(
                                    <>
                                       <div className="wrapper">
                                            <ReactPlayer 
                                                className="player" 
                                                url={course.lessons[clicked].video.Location}
                                                width="100%"
                                                height="100%"
                                                controls
                                                onEnded={()=> markCompleted()}
                                            />
                                       </div>
                                    </>
                                )}

                                <ReactMarkdown 
                                children={course.lessons[clicked].content}
                                className="single-post"
                           
                           />
                        </>
                        ):(
                        <div className='d-flex justify-content-center p-5'>
                            <div className="text-center p-5">
                                <PlayCircleOutlined className="text-primary display-1 p-5" />
                                <p className="lead"> Click on the lessons to start learning </p>
                            </div>
                        </div>
                        )}
                </div>
            </div>
        </StudentRoute>
    )
}


export default SingleCourse