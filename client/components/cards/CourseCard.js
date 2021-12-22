import {Card, Badge} from 'antd'

import Link from 'next/link'
import { currencyFormatter } from '../../utils/helpers'
const {Meta} = Card

const CourseCard = ({course})=>{
    const {title, instructor, price, image, slug, paid, category} = course

    return(
        <Link href={`/course/${slug}`}>
            <a>
                <Card 
                    className="mb-4"
                    cover={
                        <img 
                            src={image.Location} 
                            alt={title}
                            style={{height:'200px', objectFit:"cover"}}
                            className="p-1"
                        />

                    }
                >
                    <h2 className="fw-bold">{title}</h2>
                    <p> by {instructor.name}</p>
                    <Badge 
                        count={category} 
                        style={{backgroundColor:"#03a914"}}
                        className="pb-2 mr-2"
                    />
                    <h4 className="pt-2">{paid? currencyFormatter({amount:price, currency:'usd'}) : "free"}</h4>
                </Card>
            </a>
        </Link>
    )
}



export default CourseCard