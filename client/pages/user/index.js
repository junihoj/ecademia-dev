import { useContext} from 'react'
import {Context} from '../../context'
import UserRoute from '../../components/routes/UserRoute';

const UserIndex = ()=>{

    const{
        state:{user},
    } = useContext(Context);

    return(
        <UserRoute>
            <h1 className="jumbotron square"> USER'S DASHBOARD</h1>
            <h1>{JSON.stringify(user)}</h1>
        </UserRoute>
    )
}

export default UserIndex;