import React from 'react';
import { API, Auth } from 'aws-amplify';
import { Navigate } from "react-router-dom";
import { Button, Icon, ProgressBar } from '@cloudscape-design/components';

import loadingGif from '../../assets/images/loading.gif';
import courseDefaultThumbnail from '../../assets/images/course-default-thumbnail.png';

export default class MyLearningCourse extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            redirectToLearn: false,
            allCompletedLectures: null,
            completedLecture: null,
            totalLectures: null,
            course: null,
        };
    }

    loadCourse() {
        const apiName = 'courses';
        const path = '/courses/' + this.props.courseId;
        
        API.get(apiName, path)
            .then((response) => {
                let totalLectures = 0;
                response.Chapters.forEach(chapter => totalLectures += chapter.lectures.filter(lecture => lecture.type !== 'section').length);
                this.setState({
                    course: {
                        id: response.ID,
                        name: response.Name,
                        categories: response.Categories,
                        tags: response.Tags,
                        level: response.Level,
                        length: response.Length,
                        description: response.Description,
                        whatToLearn: response.WhatToLearn,
                        requirements: response.Requirements,
                        chapters: response.Chapters,
                        totalLecture: 0,
                    },
                    totalLectures: totalLectures
                }, () => {
                    if (!!this.state.allCompletedLectures)
                        this.calculateProgress();
                });
            })
            .catch((error) => {
                console.log(error.response);
            });
    }
    
    async loadUserId(callback) {
        let credentials = await Auth.currentUserCredentials();
        this.setState({
            userId: credentials.identityId,
        }, callback)
    }
  
    loadUserLecture() {
        const apiName = 'courses';
        const path = '/users/lectures/' + this.state.userId;
        
        API.get(apiName, path)
            .then((response) => {
                this.setState({
                    allCompletedLectures: response.map(lecture => lecture.LectureID)
                }, () => {
                    if (!!this.state.course)
                        this.calculateProgress();
                });
            })
            .catch((error) => {
                console.log(error.response);
            });
    }

    calculateProgress() {
        let completedLectures = 0;
        this.state.course.chapters.forEach(chapter => {
            completedLectures += chapter.lectures.filter(lecture => this.state.allCompletedLectures.includes(lecture.lectureId)).length;
        })
        this.setState({completedLectures: completedLectures});
    }

    componentDidMount() {
        this.loadCourse();
        this.loadUserId(() => this.loadUserLecture());
    }

    render() {
        let course = this.state.course;

        return !!this.state.redirectToCert
            ? <Navigate to={'/cert/' + course.id} />
            : !!this.state.redirectToLearn
            ? <Navigate to={'/learn/' + course.id} />
            : !course
            ? <div><img src={loadingGif} alt="loading..." className='mylearning-loading-gif' /></div>
            : <div className='mylearning-course'>
                <div className='mylearning-course-info'>
                    <div className='mylearning-course-title'>
                        {!!course.name ? course.name : ""}
                    </div>
                    <div className='mylearning-course-property'>
                        <Icon variant='subtle' name='ticket' className='mylearning-course-property-icon'/> Level: {!!course.level ? course.level : ""}
                    </div>
                    <div className='mylearning-course-property'>
                        <Icon variant='subtle' name='check' className='mylearning-course-property-icon'/> 
                        Category: 
                        {!!course.categories ? course.categories.map((category, index) => <span key={index}>{index !== 0 ? ', ' : ' '}<a href='/#'>{category}</a></span>) : ""}
                    </div>
                    <div className='mylearning-course-property'>
                        <Icon variant='subtle' name='check' className='mylearning-course-property-icon'/> 
                        Tag:
                        {!!course.tags ? course.tags.map((tag, index) => <span key={index}>{index !== 0 ? ', ' : ' '}<a href='/#'>{tag}</a></span>) : ""}
                    </div>
                    <div className='mylearning-course-property'>
                        <Icon variant='subtle' name='status-pending' className='mylearning-course-property-icon'/> 
                        {Math.floor(course.length / 60) > 0 ? Math.floor(course.length / 60) + " hours " : ""}
                        {course.length % 60 > 0 ? course.length % 60 + " minutes" : ""}
                    </div>
                    <div className='mylearning-course-desc'>
                        {!!course.description ? course.description : ""}
                    </div>
                </div>
                <div className='mylearning-course-thumbnail'>
                    <img src={courseDefaultThumbnail} alt='Course Thumbnail'/>
                </div>
                <div className='mylearning-course-separator'/>
                <div className='mylearning-progress'>
                    {this.state.completedLectures != null && !!this.state.totalLectures 
                        ? <ProgressBar
                            value={this.state.completedLectures / this.state.totalLectures * 100}
                        /> : <img src={loadingGif} alt="loading..." className='mylearning-loading-gif' />}
                </div>
                <div className='mylearning-course-action'>
                    {this.state.completedLectures / this.state.totalLectures >= 0.8 ? <Button onClick={() => this.setState({redirectToCert: course.id})}>
                        Certificate <Icon name='file' />
                    </Button> : ""}
                    <Button variant="primary" className='btn-orange mylearning-continue-btn' onClick={() => this.setState({redirectToLearn: course.id})}>
                        Continue <Icon name='arrow-left' className='rotate-180' />
                    </Button>
                </div>
            </div>
    };
}