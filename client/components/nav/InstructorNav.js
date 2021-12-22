import Link from 'next/link'
import {useState, useEffect} from 'react'

const InstructorNav = ()=>{
    const [current , setCurrent]  = useState('')

    useEffect(()=>{
        process.browser && setCurrent(window.location.pathname)
    }, [process.browser && process.browser.pathname]);

    console.log(current)
    return (
        <div className='nav flex-column nav-pills mt-20'>
            <Link href='/instructor'>
                <a className={`nav-link ${current==="/instructor" && "active" }`}> Dashboard</a>
            </Link>

            <Link href='/instructor/course/create'>
                <a className={`nav-link ${current==="/instructor/course/create" && "active"}`}> Create Course</a>
            </Link>
        </div>
    )
}

export default InstructorNav;