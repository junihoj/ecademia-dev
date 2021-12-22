import { Modal } from "antd";
import ReactPlayer from 'react-player'

const PreviewModal = ({showModal, setShowModal, preview, setPreview})=>{

    return (
        <>
            <Modal 
                title="Course Preview" 
                visible={showModal}
                onCancel={()=>{
                    setShowModal(!showModal) 
                    setPreview('')}}
                width={720}
                footer={null}
            >
                <div className="wrapper">
                    <ReactPlayer 
                        url={preview} 
                        playing={showModal} 
                        controls={true} 
                        width="100%"
                        height="450px"
                    />
                </div>
            </Modal>
        </>
    )
}

export default PreviewModal