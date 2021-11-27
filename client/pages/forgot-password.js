import { useContext, useEffect, useState } from "react";
import { SyncOutlined } from "@ant-design/icons";
import axios from "axios";
import Link from "next/link";
import { Context } from "../context";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

const ForgotPassword = ()=>{
    //state
    const [email, setEmail] = useState('')
    const [success, setSuccess] = useState(false)
    const [code, setCode] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [loading, setLoading] = useState('')

    //context
    const {state:{user}} = useContext(Context)

    const router = useRouter()

    //redirect with useEffect if user is loggedin
    useEffect(()=>{
        if(user !==null) router.push('/')
    }, []);

    const handleSubmit= async (e)=>{
        e.preventDefault()
        try{
            setLoading(true)
            const {data} = await axios.post('/api/forgot-password', {email})
            setSuccess(true)
            toast('Check your email from the secret code');
            setLoading(false)
        }catch(err){
            setLoading(false)
            toast(err.response.data)
            // toast(err);
        }
    }
    const handleResetPassword = async (e)=>{
        e.preventDefault()
        console.log(email, code, newPassword)
        try{
            setLoading(true)
            const {data} = await axios.post('/api/reset-password', {email, code, newPassword})
            setEmail('')
            setNewPassword('')
            setLoading(false)
            toast('Password Reset Successful , You can now login with your new Password')
        }catch(err){
            setLoading(false)
            toast(err.response.data)
        }
    }
    return (
        <>  
            <h1 className="jumbotron text-center bg-primary square">
                Forgot  Password
            </h1>

            <div className="container col-md-4 offset-md-4 pb-5">
                <form onSubmit={success? handleResetPassword : handleSubmit}>
                    <input 
                        type="email" 
                        className="form-control mb-4 p-4" 
                        value={email}
                        onChange={(e)=>setEmail(e.target.value)}
                        placeholder="Enter email"
                        required
                    />

                    {success && <>
                        <input 
                            type="text" 
                            className="form-control mb-4 p-4" 
                            value={code}
                            onChange={(e)=>setCode(e.target.value)}
                            placeholder="Enter Secret Code"
                            required
                        />
                        <input 
                            type="password" 
                            className="form-control mb-4 p-4" 
                            value={newPassword}
                            onChange={(e)=>setNewPassword(e.target.value)}
                            placeholder="Enter password"
                            required
                        />
                    </>}
                    <br/>
                    <button 
                        type="submit" 
                        className="btn btn-primary btn-block p-2"
                        disabled={loading || !email}
                    > 
                            {loading ? <SyncOutlined spin/>: "Submit"}
                    </button>
                </form>
            </div>
        </>
    )
}

export default ForgotPassword;