import { WindowsFilled } from '@ant-design/icons'
import {Button, } from 'antd'
import Link from 'next/link'
const BecomeInstructor = ()=>{
    return(
        <>
            <h1 className="jumbotron "></h1>
            <Link href="/user/become-instructor/stripe-account">
                <a>Accept Payment Using Stripe</a>
            </Link>

            <Link href="/user/become-instructor/flutterwave-account">
                <a>Accept Payment FlutterWave</a>
            </Link>
        </>
    )
}

export default BecomeInstructor