import {Menu} from 'antd'
import Link from 'next/link'
import {
    AppstoreOutlined, 
    CoffeeOutlined, LoginOutlined, 
    LogoutOutlined, UserAddOutlined, AccountBookFilled,
    CarryOutOutlined,
    TeamOutlined,
} from '@ant-design/icons'
import { useState, useEffect, useContext } from 'react'
import {Context} from '../context/index'
import axios from 'axios'
import {toast} from 'react-toastify'
import { useRouter } from 'next/router'



const {Item, SubMenu, ItemGroup} = Menu //To avoid writting Menu.Item
const TopNav = ()=>{
    const [current, setCurrent] = useState("");
    useEffect(()=>{
        process.browser && setCurrent(window.location.pathname)
    }, [process.browser && window.location.pathname]);

    const {state, dispatch} = useContext(Context)
    
    const {user} = state;
    const router = useRouter()

    const logout = async ()=>{
        dispatch({
            type:"LOGOUT"
        });
        window.localStorage.removeItem('user');
        const {data} = await axios.get("/api/logout");
        toast(data.message);
        router.push('/login')
    }
    return(
        <Menu 
            mode='horizontal' 
            className="fixme" 
            selectedKeys={[current]}
        >
            <Item 
                key="/" 
                icon={<AppstoreOutlined/>}
                onClick={(e)=>setCurrent(e.key)}
            
            >
                <Link href='/'>
                    <a>App</a>
                </Link>
            </Item>
            {/*  
                show only Registration and Login route 
                only when user is login
            */}
            {
                user === null && (
                <>
                <Item 
                    key="/login" 
                    icon={<LoginOutlined />}
                    onClick={(e)=>setCurrent(e.key)} 
                >
                    <Link href='/login'>
                        <a>Login</a>
                    </Link>
                </Item>

                <Item 
                    icon={<UserAddOutlined />} 
                    key="/register"
                    onClick={(e)=>setCurrent(e.key)}
                >
                    <Link href='/register'>
                        <a>Register</a>
                    </Link>
                </Item>
                </>
            )}
            
            {user && user.role && user.role.includes("Instructor")? (
                <Item  
                    icon={<CarryOutOutlined/>}
                    key="/instructor/course/create"
                    onClick={(e)=>setCurrent(e.key)}
                    className="float-end"
                >
                   <Link href="/instructor/course/create">
                        <a> Create Course</a>
                   </Link>
                </Item> 
            ):(
                <Item 
                    icon={<TeamOutlined/>} 
                    key="/user/become-instructor"
                    onClick={(e)=>setCurrent(e.key)}
                    className="float-end"
                >
               <Link href="/user/become-instructor">
                    <a> Become Instructor</a>
               </Link>
            </Item> 
            )}

           {user !== null && (
                <SubMenu icon= {<CoffeeOutlined/>} title={user && user.name}>
                    <ItemGroup mode="vertical">
                        <Item 
                        icon={<LogoutOutlined />} 
                        key="/logout"
                        onClick={logout}
                        className="float-end"
                        >
                            Logout
                        </Item>

                        <Item 
                        icon={<AccountBookFilled/>} 
                        key="/user"
                        className="float-end"
                        >
                            <Link href="/user">
                                <a>Dashboard</a>
                            </Link>
                        </Item>
                    </ItemGroup> 
                </SubMenu>
           )}
        </Menu>
        )
}

export default TopNav