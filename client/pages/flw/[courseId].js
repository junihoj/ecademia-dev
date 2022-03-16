import {useEffect} from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
const CourseEnroll = ()=>{
    const router = useRouter();

    // const {courseId} = router.query;
    
    const {courseId, status,transaction_id, tx_ref } = router.query;
    console.log(router);
    useEffect(()=>{
        console.log("query params", router.query)
        /* 
            1. send request to backend to with attach txt_ref and 
            courseId: "61b4c32202f66e3a73b7c224"
            status: "successful"
            transaction_id: "3219320"
            tx_ref: "t6PFhNalG0ElCH9aoynMa" 
        */

        if(courseId) successRequest();
    },[courseId])

    const successRequest = async ()=>{
        const {data} =await axios.get(`/api/flw_courseenroll/${courseId}?status=${status}&tx_ref=${tx_ref}&transaction_id=${transaction_id}`);
        // router.push(`user/course/${data.course.slug}`); // push to user's course view page
        console.log("response redirect", data)
        router.push(`/user/course/${data.course.slug}`);
    }
    
    return(
        <div>
        
        </div>
    )
}


export default CourseEnroll;