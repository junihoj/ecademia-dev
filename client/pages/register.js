import { useState, useContext, useEffect } from "react"
import axios from 'axios'
import { toast } from "react-toastify"
import { SyncOutlined } from "@ant-design/icons"
import Link from 'next/link'
import { Context } from "../context"
import { useRouter } from "next/router"


const Register = ()=>{
    const [name, setName ] = useState('Ebuka')
    const [email, setEmail] = useState('firstemail@email.com')
    const [password, setPassword] = useState('ldjad')
    const [loading, setLoading] = useState(false)

    const {state, dispatch} = useContext(Context)

    const {user} = state;
    const router = useRouter()

    useEffect(()=>{
        if (user) router.push('/')
    },[user])


    const handleSumit = async (e)=>{
        //TODO:SHOW TOAST ERROR MESSAGE FOR REGISTRATION
        e.preventDefault();
       try {
           setLoading(true);
            console.table({name, email, password})
            // ${process.env.NEXT_PUBLIC_API}
            const {data} = await axios.post(
                `/api/register`,
                {name:name, email:email,password:password}
            );
            console.log("Register response", data);
            toast.success("Registration successful.. Please Login");
            setLoading(false)
       } catch (error) {
        //    toast.error(error.response.data)
            //   toast.error(error)
            console.log(error)
           setLoading(false);
       }
    }
    
    return(
        <>
            <h1 className="jumbotron square"> Registration Page</h1>
            <p>Register</p>
            <div className="container col-md-4 offset-md-4 pb-5">
                <form onSubmit={handleSumit}>
                    <input type="text" className="form-control mb-4 p-4" 
                        value={name} 
                        onChange={e=>setName(e.target.value)} 
                        placeholder="Enter Name"
                    
                    />

                    <input type="email" className="form-control mb-4 p-4" 
                        value={email} 
                        onChange={e=>setEmail(e.target.value)} 
                        placeholder="Enter Email"
                        required
                    />

                    <input type="password" className="form-control mb-4 p-4" 
                        value={password} 
                        onChange={e=>setPassword(e.target.value)} 
                        placeholder="Enter Password"
                        required
                    />

                    <br/>
                    <button className="btn btn-block btn-primary p-2"
                        disabled={!name || !email || !password || loading}
                    >
                        {loading? <SyncOutlined /> : "Register"}
                    </button>
                </form>
                <p className="text-center login">
                    Already registered ?  &nbsp;
                    <Link href="/login">
                        <a className="btn btn-primary text-center">Login Here</a>
                    </Link>
                </p>
            </div>
        </>
    )
}


export default Register