import { useState,useEffect, useContext } from "react";
import axios from "axios";
import {useRouter} from 'next/router'
import SingleCourseJumbotron from "../../components/cards/SingleCourseJumbotron";
import PreviewModal from "../../components/modal/PreviewModal";
import SingleCourseLessons from "../../components/cards/SingleCourseLessons";
import {Context} from '../../context'
import {toast} from 'react-toastify'
import { FlutterWaveButton, closePaymentModal, useFlutterwave } from 'flutterwave-react-v3';

// import {loadStripe} from '@stripe/stripe-js'


const SingleCourse = ({course})=>{

    const [showModal, setShowModal] = useState(false)
    const [preview , setPreview] = useState('')
    const [loading, setLoading] = useState(false)
    const [enrolled, setEnrolled] = useState([])
    const router = useRouter()
    const {slug} = router.query
    const {lessons } = course



    //react flutterwave setup

    const config = {
        public_key:'FLWPUBK_TEST-fb1ef20c3c96cf19fc71eec1c4f34ac0-X',
        tx_ref: Date.now(),
        amount: course.price,
        currency: "NGN",
        redirect_url: `http://localhost:3000/flw/${course._id}`,
        meta: {
            // consumer_id: user._id,
            consumer_mac: "92a3-912ba-1192a"
            // userId:req.user._id,
            // courseId:course._id,
        },
        customer: {
            email: "user@gmail.com",
            phonenumber: "080****4528",
            name: "Yemi Desola"
        },
        customizations: {
            title: "Pied Piper Payments",
            logo: "https://images-platform.99static.com//_QXV_u2KU7-ihGjWZVHQb5d-yVM=/238x1326:821x1909/fit-in/500x500/99designs-contests-attachments/119/119362/attachment_119362573"
        }
    }
    //context
    const {state: {user}} = useContext(Context)

    useEffect(()=>{
        if(user && course) checkEnrollment()
    },[user, course])

    const checkEnrollment = async ()=>{
        const {data} = await axios.get(`/api/check-enrollment/${course._id}`)
        console.log("CHECK ENROLLMENT", data)
        setEnrolled(data)
    }

    // const handlePaidEnrollment= async ()=>{
    //     // console.log('handle paid erollment')

    //     //TODO: npm i @stripe/stripe-js
    //     try{
    //         if(!user) router.push('/login')

    //         // check for user enrollment
    //         if(enrolled.status) return router.push(`/user/course/${enrolled.course.slug}`)
    //         setLoading(true)
    //         const {data} = await axios.post(`/api/paid-enrollment/${course._id}`)
    //         const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY)
    //         stripe.redirectToCheckout({sessionId: data})
    //     }catch(err){
    //         toast('Enrollment failed, try again.')
    //         console.log(err)
    //         setLoading(false)
    //     }

    // }

    const handlePaidEnrollment = async ()=>{
        /* 
            1. send to server and check if it is a free or paid course
            2. if a free course then return else flutterwave standard payment
        */
        console.log("paid enrollement");
        const {data} = await axios.get(`/api/check-paid/${course._id}`);
        console.log("PAID",data)
        window.location.href=data;
        
      /*   if(data){
            //TODO: LATER CHANGE PAYMENT TO SERVER SIDE
           
        } */

    }

    const handleFluttterPayment = useFlutterwave(config);
    const handleFlutterwave = ()=>{
        handleFluttterPayment({
            callback:(response) => {
                console.log(response);
                 closePaymentModal() // this will close the modal programmatically
             },
             onClose: () => {},
        });
    }
    const handleFreeEnrollment = async (e)=>{
        e.preventDefault()
        try{
            //check if user is loggedin
            if(!user) router.push('/login')

            // check for user enrollment
            if(enrolled.status) return router.push(`/user/course/${enrolled.course.slug}`)
            setLoading(true)
            const {data}= await axios.post(`/api/free-enrollment/${course._id}`)
            toast(data.message)
            setLoading(false)
            router.push(data.course.slug)
        }catch(err){
            console.log(err)
            toast('Enrollment failed. Try again.')
            setLoading(false)
        }
        
    }

    return(
        <>
            <SingleCourseJumbotron 
                course={course}
                showModal={showModal}
                setShowModal={setShowModal}
                preview={preview}
                setPreview={setPreview}
                user={user}
                loading={loading}
                handleFreeEnrollment={handleFreeEnrollment}
                handlePaidEnrollment={handlePaidEnrollment}
                handleFluttterPayment={handleFluttterPayment}
                enrolled={enrolled}
                setEnrolled={setEnrolled}
            />
            {/*showModal ? lessons[0].video.Location : "don't show" */}

            <PreviewModal  
                showModal={showModal}
                setShowModal={setShowModal}
                preview={preview}
                setPreview={setPreview}
            />

            <hr />
            {course.lessons && (
                <SingleCourseLessons 
                    lessons= {course.lessons}
                    setPreview={setPreview}
                    preview={preview}
                    showModal={showModal}
                    setShowModal={setShowModal}
                />
            )}
        </>
    )
}


export async function getServerSideProps({query}){
    const {data} = await axios.get(`${process.env.API}/course/${query.slug}`)

    return{
        props:{
            course:data
        }
    }
}

export default SingleCourse