import express from 'express'
import formidable from 'express-formidable'

const router = express.Router();


//middleware
import { requireSignin, isInstructor } from '../middlewares';

//require controllers

import {
    uploadImage,
    removeImage,
    create,
    read,
    uploadVideo,
    removeVideo,
    addLesson,
    update, 
    removeLesson,
    updateLesson,
    publishCourse,
    unpublishCourse,
    courses,
    checkEnrollment,
    freeEnrollment,
    paidEnrollment,
    stripeSuccess
    
} from '../controllers/course'

router.get('/courses', courses)

//images route
router.post('/course/upload-image', uploadImage)
router.post('/course/remove-image', removeImage)

//course
//single params
router.post('/course', requireSignin, isInstructor, create)
router.put('/course/:slug',requireSignin, update)
router.get('/course/:slug',read)
router.put('/course/publish/:courseId', requireSignin, publishCourse);
router.put('/course/unpublish/:courseId', requireSignin, unpublishCourse);
router.post('/course/video-upload/:instructorId', requireSignin, formidable(), uploadVideo)
router.post('/course/remove-video/:instructorId', requireSignin, removeVideo)

//two params
router.post('/course/lesson/:slug/:instructorId',
    requireSignin,
    addLesson
)

router.put('/course/lesson/:slug/:instructorId',
    requireSignin,
    updateLesson 
)
router.put('/course/:slug/:lessonId', requireSignin, removeLesson)

//enrollment routes
router.get('/check-enrollment/:courseId', requireSignin, checkEnrollment)
router.post('/free-enrollment/:courseId',requireSignin, freeEnrollment)
router.post('/paid-enrollment/:courseId',requireSignin, paidEnrollment)

router.get('/stripe-success/:courseId', requireSignin, stripeSuccess)
module.exports = router;
