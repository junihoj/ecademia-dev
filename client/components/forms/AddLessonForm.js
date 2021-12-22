import {Button, Progress, Tooltip} from 'antd'
import {CloseCircleFilled} from '@ant-design/icons'


const AddLessonForm = ({
    values, 
    setValues, 
    handleAddLesson,
    uploading, 
    uploadButtonText,
    handleVideo,
    handleVideoRemove,
    progress
})=>{

    return(
        <div className="container pt-3">
            <form onSubmit={handleAddLesson}>
                <input 
                    type="text" 
                    className="form-control square" 
                    onChange={e=>setValues({...values, title:e.target.value})} 
                    value={values.title}
                    placeholder="Title"
                    autoFocus
                    required
                />

                <textarea 
                    className="form-control mt-3" 
                    cols="7" rows="7"
                    onChange={e=>setValues({...values, content:e.target.value})}
                    value={values.content}
                    placeholder="Content"
                >
                
                </textarea>

                <div className="d-flex justify-content-center">
                    <label className="btn btn-block btn-dark text-left mt-3">
                        {uploadButtonText}
                        <input type="file" accept="video/*" hidden  onChange={handleVideo}/>
                    </label>

                    {!uploading && values.video.Location && (
                        <Tooltip title="Remove">
                            <span onClick={handleVideoRemove} className="pt-1 pt-3">
                                <CloseCircleFilled className="text-danger d-flex justify-content-center pt-4" />
                            </span>
                        </Tooltip>
                    )}
                </div>

                <Button 
                    onClick={handleAddLesson}
                    className="col mt-3"
                    size="large"
                    type="primary"
                    loading={uploading}
                    shape="round"
                    block
                >
                    Save
                </Button>

                {progress > 0 && (
                    <Progress
                        className="d-flex justify-content-center pt-2"
                        percent = {progress}
                        steps={10}
                    />
                )}

            </form>
        </div>
    )
}

export default AddLessonForm;