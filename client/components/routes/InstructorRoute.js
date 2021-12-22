import {useEffect, useState, useContext} from 'react'
import {Context} from '../../context'
import axios from 'axios'
import { useRouter } from 'next/router'
import {SyncOutlined} from '@ant-design/icons'
import InstructorNav from '../nav/InstructorNav'

const InstructorRoute = ({children})=>{

    //state 
    const [ok, setOk] = useState('');

    const router = useRouter()
    const{
        state:{user},
    } = useContext(Context);
    useEffect(()=>{
        const fetchInstructor = async ()=>{
            try{
                const {data} = await axios.get('/api/current-instructor');
                console.log(data);
                setOk(true);   
                    
            }catch(err){
                console.log(err);
                setOk(false)
                router.push('/login')
            }
        }

        fetchInstructor();

    }, [])

    return(
        
            <>
                {/*<h1>{hidden && JSON.stringify(user)}</h1>*/}
                {!ok? 
                    (<SyncOutlined 
                        spin
                        className="d-flex justify-content-center display-1 text-primary p-5"
                    />): (

                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-md-2">
                                    <InstructorNav /> 
                                
                                </div>

                                <div className="col-md-10">{children}</div>
                            </div>
                        </div>
                )}
            </>
        
    )
}

export default InstructorRoute;