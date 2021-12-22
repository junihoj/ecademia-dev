import { useEffect, useState } from "react";
import { Select, Button, Avatar, Badge } from "antd";

const {Option} = Select

const CourseCreateForm=({
    handleSubmit,
    handleImage,
    handleChange,
    values,
    setValue,
    preview,
    uploadButtonText,
    handleImageRemove=(f)=>f,
    editPage = false,
 })=>{

    const children = []

    for (let i=0.99; i<=99.99; i++){
        children.push(<Option key={i.toFixed(2)}>${i.toFixed(2)}</Option>)
    }
    return (
        <>
            {values && (
                <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    className="form-control" 
                    placeholder="name" 
                    name="title"
                    onChange={handleChange}
                    value={values.title}
                />
         
                <textarea 
                    className="form-control mt-5" 
                    placeholder="Description"
                    name="description"
                    value={values.description}
                    onChange={handleChange}
                ></textarea>
         
                <Select 
                    value={values.paid}
                    style={{width:"100%"}}
                    size="large"
                    onChange={e=>setValue({...values, paid: !values.paid})}
                >
                    <Option value={true}>Paid</Option>
                    <Option value={false}>Free</Option>
                </Select>
         
                {
                 values.paid && (
                 <Select 
                     defaultValue= "$9.99"
                     style={{width:"100%"}}
                     size="large"
                     onChange={v=>setValue({...values, price: v})}
                     tokenSeparators={[,]}
                 >
                 {children}
             </Select>
             )}
         
             <input 
                    type="text" 
                    class="form-control" 
                    placeholder="category" 
                    name="category"
                    onChange={handleChange}
                    value={values.name}
             />
                
                <div class="row">
                    <div class="col-md-11">
                        <label
                            className="btn btn-outline-secondary btn-block text-left"
                            style={{width:"100%"}}
                        >
                            {/*values.loading? 'Uploading' : 'Image Upload'*/}
                            {uploadButtonText}
                            <input
                                type='file'
                                name="image" onChange={handleImage}
                                accept="image/*"
                                hidden
                            />
                        </label>
                    </div>
                    {preview && (
                     <div className="col">
                         <Badge count="X" onClick={handleImageRemove} className="pointer-event">
                             <Avatar width={200} src={preview}/>
                         </Badge>
                     </div> 
                 )}
         
                 {editPage && values.image && <Avatar width={200} src={values.image.Location}/>}
                </div>
         
                <div className="row">
                    <div className="col">
                        <Button 
                            onClick={handleSubmit} 
                            disabled={values.loading || values.uploading}
                            className="btn btn-primary"
                            loading={values.loading}
                            type="primary"
                            size="large"
                            shape="round"
                        >
                        {values.loading ? "Saving..." : "Save & Continue"}
                        </Button>
                    </div>
                </div>
             </form>   
            
            )}
        </>
    )

}
export default CourseCreateForm;