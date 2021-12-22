import { currencyFormatter } from "../../utils/helpers"
import ReactPlayer from "react-player"
import { Badge, Button } from "antd"
import {LoadingOutlined, SafetyOutlined} from '@ant-design/icons'
const SingleCourseJumbotron = ({
    course,
    showModal,
    setShowModal,
    preview,
    setPreview,
    loading,
    user,
    handleFreeEnrollment,
    handlePaidEnrollment,
    enrolled,
    setEnrolled
})=>{


    const {
        title, 
        description, 
        instructor, 
        updatedAt, 
        lessons, 
        image, 
        price,
        paid,
        category
    } = course

    return (
            <div className="container-fluid">
            <div class="jumbotron bg-primary square">
                <div className="row">
                    {/*<pre>{JSON.stringify(course,null,4)}</pre>*/}
                    <div className="col-md-8">
                        {/** title */}
                        <h1 className="text-light fw-bold">{title}</h1>
                        {/** description */}
                        <p className="lead">{description && description.substring(0, 100)} ...</p>
                        {/** category */}
                        <Badge count={category} style={{ backgroundColor: "#03a9f4"}} className="pb-4 mr-4"/>

                        {/** author */}
                        <p> Created by {instructor.name}</p>

                        {/** updated at */}
                        <p>Last updated {new Date(updatedAt).toLocaleString()}</p>

                        {/** price */}
                        <h4 className="text-light">{
                            paid ? currencyFormatter({
                                amount: price, 
                                currency: 'usd'
                            }) : 'free'
                        }</h4>
                    </div>

                    <div className="col-md-4">
                        {/** show video preview or course image */}
                        {lessons[0].video && lessons[0].video.Location ? (
                            <div onClick={()=> {
                                setPreview(lessons[0].video.Location)
                                setShowModal(!showModal)
                            }}> 
                                <ReactPlayer 
                                    className="react-player-div" 
                                    url={lessons[0].video.Location} 
                                    width="100%"
                                    height="225px"
                                    light={image.Location}
                                />
                            </div>) :(
                            <>
                                <img 
                                    src={image.Location}
                                    alt={title}
                                    className="img img-fluid"
                                />
                            </>
                        )}
                        {/* * Course enrollemnt */}
                        {loading? (
                            <div className="d-flex justify-content-center">
                                <LoadingOutlined />
                            </div>
                            ):(
                                <Button
                                    className="mb-3"
                                    type="danger"
                                    block
                                    shape="round"
                                    icon={<SafetyOutlined />}
                                    size="large"
                                    disabled={loading}
                                    onClick={paid ? handlePaidEnrollment : handleFreeEnrollment}
                                >
                                    {user? 
                                        enrolled.status? 
                                        "Go to course"
                                        :"Enroll to course" 
                                    : "Login to enroll"}
                                </Button>
                            )}
                    </div>
                </div>
            </div>
    </div>

    )
}

export default SingleCourseJumbotron