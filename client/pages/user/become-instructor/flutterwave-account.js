import axios from "axios";
import {useContext, useState, useMemo, useEffect} from 'react'
import {Context} from '../../../context'
import {Button} from 'antd'
import {SettingOutlined, 
        UserSwitchOutlined, 
        LoadingOutlined, 
        WindowsFilled, 
        SyncOutlined
    } from '@ant-design/icons'
import {toast} from 'react-toastify'
import Select from 'react-select'
import countryList from 'react-select-country-list'

// import UserRoute from '../../components/routes/UserRoute'

const BecomeInstructorFlutterwave= ()=>{
    const {state:{user}, dispatch} = useContext(Context)
    console.log(user)
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState(user ? user.email : '')
    const [businessName, setBusinessName] = useState('')
    const [businessMobile, setBusinessMobile] = useState('')
    const [businessContact, setBusinessContact] = useState('')
    const [businessContactMobile, setBusinessContactMobile] = useState('')
    const [country, setCountry] = useState('')
    const [accountNumber, setAccountNumber] = useState('')
    const [banks, setBanks] = useState('')
    const [bank, setBank] = useState('')
    const acceptedCountry = ['NG', 'UG', 'GH']
    const [value, setValue] = useState('')
    const options = useMemo(() => countryList().getData(), [])
   
    const becomeInstructor = (e)=>{
        e.preventDefault()
        const data =  {
            "account_bank": bank,
            "account_number": accountNumber,
            "business_name": businessName,
            "business_email": email,
            "business_mobile": businessMobile,
            "country": country,
            "business_contact": businessContact,
            "business_contact_mobile": businessContactMobile,
        }

           
        
        console.log("become an instructor")
        setLoading(true)
        axios.post('/api/make-instructor/flutterwave', data)
        .then(res=>{
          console.log(res.data)
        //  window.location.href= res.data;
            dispatch({type:"LOGIN", payload: res.data})
            //save user in the local storage
            window.localStorage.setItem('user', JSON.stringify(res.data))
            window.location.href= "/instructor"
        })
        .catch(err=>{
            // console.log(err.response.status)
            console.log(err)
            toast("Flutterwave onBoarding Failed. Try again")
            setLoading(false);
        })
    }

    const handleBanks = (value)=>{
        setValue(value)
        const {value:ISO_CODE} = value
        setCountry(ISO_CODE)
        console.log(ISO_CODE)
        if(acceptedCountry.includes(ISO_CODE)){
            console.log('accepted')
            //send axios to backend for available branch in the country
            axios.post('/api/get-banks', {ISO_CODE}).then((res)=>{
                setBanks(res.data.Banks.data)
            }).catch((err)=>{
                console.log(err)
            })
        }
        setBanks(undefined)
    }

    return(
        <>
            <h1 className="jumbotron text-center square">Become an Instructor</h1>
            <div className="container">
                <div className="row">
                    <div className="col-md-6 offset-md-3 text-center">
                        <div className="pt-4">
                            {
                                (user && user.role && user.role.includes('Instructor'))? "You're already an Instructor" :
                                
                                (
                                    <form onSubmit={becomeInstructor}>

                                        <input type="text" className="form-control mb-4 p-4" 
                                            value={businessName} 
                                            onChange={e=>setBusinessName(e.target.value)} 
                                            placeholder="Enter Business Name"
                                            required                                          
                                        />

                                        <input type="email" className="form-control mb-4 p-4" 
                                            value={email} 
                                            onChange={e=>setEmail(e.target.value)} 
                                            placeholder="Business Email"
                                            required
                                            disabled={!!email}
                                        />

                                        <Select options={options} value={value} onChange={handleBanks} />
                                    
                                        {   !banks? 
                                            (<Select options={[]} value={null} />) : 
                                            (
                                                <select onChange={e=>setBank(e.target.value)} required>
                                                    {banks.map((banks, index)=>(<option value={banks.code} key={index}>{banks.name}</option>))}
                                                </select>
                                            )
                                        }
                                        
                                        <input type="text" className="form-control mb-4 p-4" 
                                            value={accountNumber} 
                                            onChange={e=>setAccountNumber(e.target.value)} 
                                            placeholder="Enter Account number"
                                            required
                                        />

                                        <input type="number" className="form-control mb-4 p-4" 
                                            value={businessMobile} 
                                            onChange={e=>setBusinessMobile(e.target.value)} 
                                            placeholder="Business Mobile Phone Number"
                                            required
                                        />

                                        <input type="text" className="form-control mb-4 p-4" 
                                            value={businessContact} 
                                            onChange={e=>setBusinessContact(e.target.value)} 
                                            placeholder="Business Contact"
                                            required
                                        />

                                        <input type="number" className="form-control mb-4 p-4" 
                                            value={businessContactMobile} 
                                            onChange={e=>setBusinessContactMobile(e.target.value)} 
                                            placeholder="Business Contact Phone Number"
                                            required
                                        />
                                       

                                        <br/>
                                        <button className="btn btn-block btn-primary p-2"
                                            disabled={!email || !businessMobile || loading}
                                        >
                                            {loading? <SyncOutlined /> : "Register"}
                                        </button>
                                    </form>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}


export default BecomeInstructorFlutterwave;