import {useState, useEffect} from 'react'
import axios from "axios";
import InstructorRoute from "../../components/routes/InstructorRoute";
import {Avatar, Tooltip} from 'antd'
import Link from 'next/link'
import {CheckCircleOutlined, CloseCircleOutlined} from '@ant-design/icons'


const CourseCreate= ()=>{
    const [courses, setCourses] = useState([])

    useEffect(()=>{
        loadCourses()
    }, [])

    const loadCourses = async ()=>{
            const {data}  = await axios.get('/api/instructor-courses')
            setCourses(data)
    }

    const myStyle = {marginTop:"-15px", fontSize:"10px"}
    // console.log("COURSES", courses[0].image.Location)
    return(
        <InstructorRoute>
            <h1 
                className="jumbotron text-center square"
            >
                Instructor Dashboard
            </h1>

             {JSON.stringify(courses)}
             {courses && courses.map(course=>(
                 <>
                    <div className="media">
                        <Avatar 
                            size={80}
                            src={course.image? course.image.Location : "/course.png"}
                        />

                        <div className="media-body pt-2">
                            <div className="row">
                                <div className="col">
                                    <Link
                                        href={`/instructor/course/view/${course.slug}`}
                                        className="pointer"
                                    >
                                        <a className="h5 mt-5 text-primary">{course.title}</a>
                                    </Link>

                                    <p style={{marginTop:"-10px"}}>{course.lessons.length}  Lessons</p>

                                    {course.lessons.length< 5 ? (<p className="text-warning" style={myStyle}> At least 5 lessons are required to publish a course</p>
                                        ): course.published? (
                                           <p className="text-warning" style={myStyle}>Your course is live in the marketplace</p>
                                        ):(
                                            <p className="text-warning" style={myStyle}>Your course is ready to be publish</p>
                                        )}
                                </div>
                                <div className="col-md-3 text-center mt-3">
                                    {course.published ? (
                                        <Tooltip title="Published">
                                            <CheckCircleOutlined className="h5 pointer text-success" />
                                        </Tooltip>
                                            ): (
                                                <Tooltip title="Unpublished">
                                                    <CloseCircleOutlined className="h5 pointer text-warning" />
                                                </Tooltip>
                                    )}
                                </div>
                            </div>

                        </div>

                    </div>
                    
                 </>
             ))}

        </InstructorRoute>
            
    )
}


export default CourseCreate;