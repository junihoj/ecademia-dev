import axios from "axios";
import {useContext, useState} from 'react'
import {Context} from '../../context'
import {Button} from 'antd'

import {SettingOutlined, UserSwitchOutlined, LoadingOutlined, WindowsFilled} from '@ant-design/icons'
import {toast} from 'react-toastify'
import UserRoute from '../../components/routes/UserRoute'

const BecomeInstructor= ()=>{

    const [loading, setLoading] = useState(false)
    const {state:{user}} = useContext(Context)

    const becomeInstructor = ()=>{
        console.log("become an instructor")
        setLoading(true)
        axios.post('/api/make-instructor')
        .then(res=>{
          Window.location.href  = res.data;
        })
        .catch(err=>{
            console.log(err.response.status)
            toast("Stripe onBoarding Failed. Try again")
            setLoading(false);
        })
    }

    return(
        <>
            <h1 className="jumbotron text-center square">Become an Instructor</h1>
            <div className="container">
                <div className="row">
                    <div className="col-md-6 offset-md-3 text-center">
                        <div className="pt-4">
                            <UserSwitchOutlined className="display-1 pb-3" />
                            <br />
                            <h2> 
                                Setup Payout to publish courses on Ecademia
                            </h2>
                            <p className="lead text-warning">
                                Edemy Partners with stripe to transfer earnings 
                                to your bank account
                            </p>
                            <Button 
                                className="mb-3" 
                                type="primary" 
                                block 
                                shape="round" 
                                size="large"
                                icon={loading ? <LoadingOutlined /> : <SettingOutlined/>}
                                onClick={becomeInstructor}
                                disabled={user && user.role && user.role.includes('Instructor') || loading}
                            >
                              {loading ? "Processing" : "Payout Setup"}  
                            </Button>

                            <p className="lead"> 
                                you will be redirected to stripe to complete onboarding process.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}


export default BecomeInstructor;