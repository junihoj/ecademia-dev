import {
    createContext, 
    useReducer, 
    useEffect
} from 'react'

import axios from 'axios'
import router, { useRouter } from 'next/router';

// create initial state

const initialState = {
    user:null,
}

const Context = createContext();

const rootReducer = (state,action)=>{
     switch(action.type){
         case "LOGIN":
             return {...state, user:action.payload};
            
        case "LOGOUT":
            return {...state, user:null};

        default:
            return state;
     }
}

//context provider

const Provider = ({children})=>{
    const [state, dispatch] = useReducer(rootReducer, initialState)

    useEffect(()=>{
        dispatch({
            type:'LOGIN',
            payload:JSON.parse(window.localStorage.getItem('user'))
        })
    },[])

    const router = useRouter();
 
    axios.interceptors.response.use((response)=>{
        return response;
    }, (error)=>{
        const res = error.response;
        console.log('RESPONSE', res);
        if(res.status === 401 && res.config && !res.config.__isRetryRequest){
            return new Promise((resolve, reject)=>{
                axios.get('/api/logout').then((data)=>{
                    console.log("/401 error > Logout");
                    dispatch({
                        type:'LOGOUT'
                    })
                    window.localStorage.removeItem("user")
                    router.push('/login')
                })
                .catch((err)=>{
                    console.log("Axios INTERCEPTORS ERR", err);
                    reject(error);
                });
            });
        }
    })

    useEffect(()=>{
        const getCsrfToken = async ()=>{
            const {data} = await axios.get("/api/csrf-token");
            axios.defaults.headers["X-CSRF-Token"] = data.getCsrfToken;

            console.log("CSRF", data);
            console.log('mycsrf', data.getCsrfToken)
        }
        getCsrfToken();
    }, [])
    return (
        <Context.Provider value={{state,dispatch}}>
            {children}
        </Context.Provider>
    )
}

export {Context, Provider}