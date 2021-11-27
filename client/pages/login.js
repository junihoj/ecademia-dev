import { useState, useContext, useEffect } from "react"
import axios from 'axios'
import { toast } from "react-toastify"
import { SyncOutlined } from "@ant-design/icons"
import Link from 'next/link'
import {Context} from '../context/index'
import { useRouter } from "next/router"


const Login = ()=>{
    const [email, setEmail] = useState('firstemail@email.com')
    const [password, setPassword] = useState('ldjad')
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    

    //state
    const {state , dispatch} = useContext(Context);
    const {user} = state;
    useEffect(() => {
       if(user !== null ){
        router.push('/')
       }
    }, [user]);

    console.log("state ", state);
    const handleSumit = async (e)=>{
        // TODO: SHOW LOGIN ERROR MESSAGE WITH TOAST
        e.preventDefault();
       try {
           setLoading(true);
            console.table({email, password})
            // ${process.env.NEXT_PUBLIC_API}
            const {data} = await axios.post(
                `/api/login`,
                {email:email,password:password}
            );
            console.log("Login  response", data);
            dispatch({
                type:"LOGIN",
                payload:data,
            })

            //save users data in local storage
            window.localStorage.setItem("user",JSON.stringify(data));
            router.push('/user')
            // route
            // setLoading(false)
       } catch (error) {
        //    toast.error(error.response.data)
        // toast.error(error);
        console.log(error);
           setLoading(false);
       }
    }
    
    return(
        <>
            <h1 className="jumbotron square"> Login Page</h1>
            <p>Register</p>
            <div className="container col-md-4 offset-md-4 pb-5">
                <form onSubmit={handleSumit}>

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
                        disabled={!email || !password || loading}
                    >
                        {loading? <SyncOutlined /> : "Register"}
                    </button>
                </form>
                <p className="text-center login">
                    Not Yet registered ?  &nbsp;
                    <Link href="/register">
                        <a className="btn btn-primary text-center">Click here to Register</a>
                    </Link>
                </p>

                <p className="text-center login">
                    <Link href="/forgot-password">
                        <a className="text-danger text-center">Forgot password?  &nbsp;</a>
                    </Link>
                </p>
            </div>
        </>
    )
}


export default Login