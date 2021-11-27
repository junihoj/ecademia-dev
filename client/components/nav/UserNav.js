import Link from 'next/link'


const UserNav = ()=>{
    return (
        <div className= "nav flex-column nav-pills mt-20">
            <Link href="/user">
                <a className="nav-link active">Dashboard</a>
            </Link>
        </div>
    )
}

export default UserNav;