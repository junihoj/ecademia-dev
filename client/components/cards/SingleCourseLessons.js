import { List, Avatar } from "antd"


const {Item } = List



const SingleCourseLessons = ({
    lessons,
    setPreview,
    showModal,
    setShowModal,
})=>{

    return(
            <div className="container">
                <div className="col lesson-list">
                    {lessons && <h4>{lessons.length} Lessons</h4>}

                    <List
                        itemLayout="horizontal"
                        dataSource={lessons}
                        renderItem={(item, index)=>(
                            <Item>
                                <Item.Meta 
                                    avatar={<Avatar>{index + 1}</Avatar>} 
                                    title={item.title}
                                />
                                { item.video && item.video !== null && item.free_preview && ( 
                                    <span
                                        className="text-primary" 
                                        onClick={()=>{
                                            setPreview(item.video.Location)
                                            setShowModal(!showModal)
                                        }}>Preview</span>
                                )}
                             
                            </Item>
                        )}
                    />
                    
                </div>
            </div>
    )
}


export default SingleCourseLessons