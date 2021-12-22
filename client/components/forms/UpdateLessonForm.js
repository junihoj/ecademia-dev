import {Button, Progress, Switch} from 'antd'
import {CloseCircleFilled} from '@ant-design/icons'
import ReactPlayer from 'react-player'

const UpdateLessonForm = ({
    current,
    setCurrent,
    handleVideo,
    handleUpdateLesson,
    uploadVideoButtonText,
    progress,
    uploading,
})=>{

    return(
        <div className="container pt-3">
            <form onSubmit={handleUpdateLesson}>
                <input 
                    type="text" 
                    className="form-control square" 
                    onChange={e=>setCurrent({...current, title:e.target.value})} 
                    value={current.title}
                    placeholder="Title"
                    autoFocus
                    required
                />

                <textarea 
                    className="form-control mt-3" 
                    cols="7" rows="7"
                    onChange={e=>setCurrent({...current, content:e.target.value})}
                    value={current.content}
                    placeholder="Content"
                >
                
                </textarea>

                <div>
                    

                    {!uploading && current.video && current.video.Location && (
                        <div className="pt-2 d-flex justify-content-center">
                            <ReactPlayer 
                                url={current.video.Location}
                                width="410px"
                                controls
                            />
                        </div>
                    )}

                    <label className="btn btn-block btn-dark text-left mt-3">
                        {uploadVideoButtonText}
                        <input type="file" accept="video/*" hidden  onChange={handleVideo}/>
                    </label>
                </div>

                <Button 
                    onClick={handleUpdateLesson}
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

                <div className="d-flex justify-content-between pt-2">
                    <span className="pt-3 badge"> Preview</span>
                    <Switch 
                        className="float-end mt-2" 
                        disabled={uploading}  
                        // defaultChecked={current.free_preview}
                        checked={current.free_preview}
                        name="free_preview"
                        onChange={v=>setCurrent({...current, free_preview: v })}
                     />
                </div>

            </form>
        </div>
    )
}

export default UpdateLessonForm;