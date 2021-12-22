import AWS from 'aws-sdk'
import {nanoid} from 'nanoid'
import {Course} from '../models/course'
import Slugify from 'slugify'
import {readFileSync} from 'fs'
import User from '../models/user'

const stripe= require('stripe')(process.env.STRIPE_SECRET)

const awsConfig  = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    apiVersion:process.env.AWS_API_VERSION
}

const S3 = new AWS.S3(awsConfig)


export const uploadImage = async (req, res)=>{
    // console.log(req.body);
    try {
        const {image} = req.body
        if(!image) return res.status(400).send('No image')
        
        //prepare the image
        const base64Data = new Buffer.from(image.replace(/^data:image\/\w+;base64,/, ''), "base64");
        const type = image.split(';')[0].split('/')[1];
        const params = {
            Bucket:"ecademia",
            Key:`${nanoid(15)}.${type}`,
            Body:base64Data,
            ContentEnconding:"base64",
            ContentType:`image/${type}`,
        }

        //  ACL:'public-read',

        //upload to s3
        S3.upload(params, (err, data)=>{
            if(err){
                console.log(err)
                return res.sendStatus(400);
            }

            console.log(data)
            res.send(data)
        })
    } catch (error) {
        console.log(error)
    }
}


export const removeImage = async (req,res)=>{
    try{
        const {image} = req.body
        const params = {
            Bucket:image.Bucket,
            Key:image.Key,
        }

        //send Image remove request to s3

        S3.deleteObject(params, (err, data)=>{
            if(err){
                console.log(err)
                res.sendStatus(400)
            }
            res.send({ok:true})
        })
    }catch(err){
        console.log(err)
    }
}


export const create = async (req, res)=>{
    // console.log("Create Course")
    
    try{
        const alreadyExist = await Course.findOne({
            slug:Slugify(req.body.title.toLowerCase())
        })
        if(alreadyExist) return res.status(400).send("Title is taken")

        const course = await new Course({
            slug:Slugify(req.body.title),
            instructor:req.user._id,
            ...req.body,
        }).save()

        res.json(course)
    }catch(err){
        console.log(err)
        return res.status(400).send('Course create failed. Try again')
    }
}


export const read = async (req, res)=>{
    try{
        const course = await Course.findOne({slug:req.params.slug}).populate(
            'instructor', 
            '_id name'
        ).exec();
        res.json(course)
    }catch(err){
        console.log(err)
    }
}


export const uploadVideo = async (req,res)=>{
    try{
        if(req.user._id !== req.params.instructorId){
            return res.status(400).send("Unauthorised")
        }
        const {video} = req.files;
        console.log('RECEIVED VIDEO DATA', video)
        if(!video) return res.status(400).send("No video")

        //video
        const params = {
            Bucket:"ecademia",
            Key:`${nanoid()}.${video.type.split("/")[1]}`,
            Body:readFileSync(video.path),
            ContentType:video.type,
        }

        S3.upload(params, (err,data)=>{
            if(err){
                console.log(err)
                res.sendStatus(400)
            }
            console.log(data)
            res.send(data)
        })
    }catch(err){
        console.log(err)
    }
}

export const removeVideo = (req,res)=>{
    try{
        if(req.user._id !== req.params.instructorId){
            return res.status(400).send("Unauthorised")
        }
        const {Bucket, Key} = req.body;
        
        // if(!video) return res.status(400).send("No video")

        //video
        const params = {
            Bucket,
            Key
        }

        S3.deleteObject(params, (err,data)=>{
            if(err){
                console.log(err)
                res.sendStatus(400)
            }
            console.log(data)
            res.send({ok:true})
        })
    }catch(err){
        console.log(err)
    }
}


export const addLesson = async (req,res)=>{
    try{
        const {slug, instructorId} = req.params
        const {title, content, video} = req.body

        if(req.user._id !== instructorId){
            return res.status(400).send("Unauthorised")
        }

        const updated = await Course.findOneAndUpdate({slug}, {
                $push:{lessons:{title,content,video,slug:Slugify(title)}}
            },
            {new:true}
        ).populate("instructor", "_id name").exec();

        res.json(updated)

    }catch(err){
        console.log(err)
        return res.status(400).send("Add Lesson Failed")
    }
}


export const update = async (req,res)=>{
    try{
        const {slug} = req.params
    // console.log(slug)
        const course = await Course.findOne({slug}).exec()
        if(req.user._id != course.instructor){
            return res.status(400).send("Unauthorized")
        }

        const updated = await Course.findOneAndUpdate({slug}, req.body, {new:true},).exec()
        res.json(updated)
    }catch(err){
        console.log(err)
        return res.status(400).send(err.message)
    }

}


export const removeLesson = async (req,res)=>{
    try{
        const {slug, lessonId} = req.params
        // console.log(slug)
        const course = await Course.findOne({slug}).exec()
        if(req.user._id != course.instructor){
            return res.status(400).send("Unauthorized")
        }

        const deletedCourse = await Course.findByIdAndUpdate(course._id,{
            $pull:{lessons:{_id: lessonId}},
        }).exec();

        res.json({ok:true})
    }catch(err){ 

    }
}


export const updateLesson = async(req,res)=>{
    try{
        const {slug} = req.params;
    // console.log('lesson updated')
        const course = await Course.findOne({slug}).select("instructor").exec()
        const {_id, title, content, free_preview, video} = req.body;
        if(course.instructor._id != req.user._id){
            return res.status(403).send("UnAuthorized")
        }

        const updated = await Course.updateOne(
            {"lessons._id":_id}, 
            {
                $set:{
                    "lessons.$.title":title,
                    "lessons.$.content":content,
                    "lessons.$.video":video,
                    "lessons.$.free_preview":free_preview,

                }
            },
            {new:true}
        ).exec()

        res.json(updated)
    }catch(err){
        console.log(err)
        return res.status(400).send("Update lesson failed")
    }

}


export const publishCourse = async (req,res)=>{
    try{
        const {courseId} = req.params
        const course = await Course.findById(courseId).select('instructor').exec()
        if(course.instructor._id != req.user._id){
            return res.status(400).send('Unauthorized')
        }

        const updated = await Course.findByIdAndUpdate(
            courseId, 
            {published:true},
            {new:true}
        )
        res.json(updated)
    }catch(err){
        console.log(err)
        return res.status(400).send('Publish course failed')
    }
}

export const unpublishCourse = async (req,res)=>{
    try{
        const {courseId} = req.params
        const course = await Course.findById(courseId).select('instructor').exec()
        if(course.instructor._id != req.user._id){
            return res.status(400).send('Unauthorized')
        }

        const updated = await Course.findByIdAndUpdate(
            courseId, 
            {published:false},
            {new:true}
        )
        res.json(updated)
    } catch(err){
        console.log(err)
        return res.status(400).send('Unpublish course failed')
    } 
}


export const courses = async (req,res)=>{
    const all = await Course.find({published:true}).populate('instructor', '_id name').exec()
  
    res.json(all)
}



export const checkEnrollment = async (req, res)=>{
    const {courseId} = req.params

    const user = await User.findById(req.user._id).exec()

    // check if course id is found in user courses array

    let ids = []
    let length = user.courses && user.courses.length

    for (let i=0; i<length; i++){
        ids.push(user.courses[i].toString())
    }
    res.json({
        status: ids.includes(courseId),
        course: await Course.findById(courseId).exec(),
    })
}


export const freeEnrollment = async (req,res)=>{
    try{
        //check if free or paid
        const course = await Course.findById(req.params.courseId).exec()
        if(course.paid) return;

        const result = await User.findByIdAndUpdate(
            req.user._id, 
            {$addToSet:{courses: course._id}},
            {new:true}
        ).exec()

        res.json({
            message:"Congratulations! you have successfully enrolled",
            course
        })
    }catch(err){
        console.log('free enrollment err', err)
        return res.status(400).send('Enrollemnt failed')
    }
}


export const paidEnrollment = async (req,res)=>{
    try{
            //check if course is free or paid

        const course = await Course.findById(req.params.courseId).populate('instructor').exec();
        if(!course.paid) return;
        //application fee 30%
        
        const fee = (course.price * 30)/100
        //create stripe session

        const session = await stripe.checkout.sessions.create({
            payment_method_types:['card'],

            //purchase detail

            line_items:[
                {
                    name:course.name, 
                    amount: Math.round(course.price.toFixed(2) * 100),
                    currency:'usd',
                    quantity:1,
                },
            ],

            //change buyer and transfer remaining balance to seller (after fee)
            payment_intent_data: {
                application_fee_amount: Math.round(fee.toFixed(2) * 100),
                transfer_data:{
                    destination:course.instructor.stripe_account_id,
                }
            },

            // redirect url after successful payment
            success_url : `${process.env.STRIPE_SUCCESS_URL}/${course._id}`,
            cancel_url:process.env.STRIPE_CANCEL_URL,
        })

        console.log('SESSION ID =>', session);

        await user.findByIdAndUpdate(req.user._id, {stripeSession: session}).exec()
    }catch(err){
        console.log('PAID ENROLLMENT', err)
        return res.status(400).send("Enrollment creation failed")
    }
}


export const stripeSuccess = async (req,res)=>{
    try{
        //findcourse
        const course = await Course.findById(req.params.courseId).exec();

        const user = await User.findById(req.user._id).exec()
        //if no stripe session return immediately
        if(!user.stripeSession.id) return res.sendStatus(400);
        //retrieve stripe session
        const session = await stripe.checkout.session.retrieve(user.stripeSession.id);
        console.log("STRIPE SUCCESS ", session);
        // if session payment status is paid, push course to user's course []

        if(session.payment_status === 'paid'){
            await User.findByIdAndUpdate(user._id, {
                $addToSet: {courses: course._id},
                $set: {stripeSession:{}}
            }).exec()
        }

        res.json({success: true, course})

    }catch(err){
        console.log('STRIPE SUCCESS ERR', err)
        res.json({success: false})
    }
}