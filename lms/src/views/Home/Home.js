import React from 'react';
import './Home.css';
import { Navigate } from "react-router-dom";
import { API } from 'aws-amplify';
import { Grid, Button, Icon } from '@cloudscape-design/components';
import NavBar from '../../components/NavBar/NavBar';
import Footer from '../../components/Footer/Footer';

import bannerIcon from '../../assets/images/dashboard-banner-icon.png';
import hightlightIcon1 from '../../assets/images/dashboard-highlight-1.png';
import hightlightIcon2 from '../../assets/images/dashboard-highlight-2.png';
import hightlightIcon3 from '../../assets/images/dashboard-highlight-3.png';
import courseDefaultThumbnail from '../../assets/images/course-default-thumbnail.png';

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            courseToRedirect: null,
            courses: [],
        };
    }

    componentDidMount() {
        const apiName = 'courses';
        const path = '/courses';
        
        API.get(apiName, path)
          .then((response) => {
            let transformedCourses = [];

            response.forEach(course => {
                transformedCourses.push({
                    id: course.ID,
                    name: course.Name,
                    categories: course.Categories,
                    tags: course.Tags,
                    level: course.Level,
                    length: course.Length,
                    description: course.Description
                });
            });

            this.setState({courses: transformedCourses});
          })
          .catch((error) => {
            console.log(error.response);
          });
    }

    redirectToCourse(courseId) {
        this.setState({courseToRedirect: courseId});
    }

    render() {
        return !!this.state.courseToRedirect ?
            <Navigate to={'/course/' + this.state.courseToRedirect} /> :
            <div>
                <NavBar navigation={this.props.navigation} title="Cloud Academy"/>
                <div className='dashboard-main'>
                    <div className='dashboard-banner'>
                        <Grid gridDefinition={[{ colspan: 10 }, { colspan: 2 }]}>
                            <div>
                                <p className='dashboard-banner-title'>AWS Cloud Academy</p>
                                <p className='dashboard-banner-desc'>This website lists all courses created by teams at Amazon Web Services (AWS). Each course provides theory lessons with interactive quiz to test your knowledge as you complete each module. You can see the course assigned to you by signing in.</p>
                            </div>
                            <div className='dashboard-banner-icon-container'>
                                <img className='dashboard-banner-icon' src={bannerIcon} alt="Banner Icon"/>
                            </div>
                        </Grid>
                    </div>
                    <div className='dashboard-highlight'>
                        <Grid gridDefinition={[{ colspan: 4 }, { colspan: 4 }, { colspan: 4 }]}>
                            <div>
                                <img className='dashboard-highlight-icon' src={hightlightIcon1} alt="Highlight Icon 1"/>
                                <div className='dashboard-highlight-text-container'>
                                    <div className='dashboard-highlight-title'>100 courses and growing</div>
                                    <div className='dashboard-highlight-desc'>New courses and content added and updated all the time.</div>
                                </div>
                            </div>
                            <div>
                                <img className='dashboard-highlight-icon' src={hightlightIcon2} alt="Highlight Icon 2"/>
                                <div className='dashboard-highlight-text-container'>
                                    <div className='dashboard-highlight-title'>Interactive quiz</div>
                                    <div className='dashboard-highlight-desc'>Test your knowledge with interactive quiz after theory lessons.</div>
                                </div>
                            </div>
                            <div>
                                <img className='dashboard-highlight-icon' src={hightlightIcon3} alt="Highlight Icon 3"/>
                                <div className='dashboard-highlight-text-container'>
                                    <div className='dashboard-highlight-title'>Certification of completion</div>
                                    <div className='dashboard-highlight-desc'>Receive a certification once complete a course.</div>
                                </div>
                            </div>
                        </Grid>
                    </div>
                    <div className='dashboard-courses'>
                        <p className='dashboard-courses-header'>Available courses</p>
                        <div className='dashboard-courses-header-decor' />
                        <div className='dashboard-courses-list'>
                            {this.state.courses.map(course => 
                                <div className='dashboard-courses-list-item' key={course.id}>
                                    <div className='dashboard-courses-list-item-info'>
                                        <div className='dashboard-courses-list-item-title'>
                                            {course.name}
                                        </div>
                                        <div className='dashboard-courses-list-item-property'>
                                            <Icon variant='subtle' name='ticket' className='dashboard-courses-list-item-property-icon'/> Level: {course.level}
                                        </div>
                                        <div className='dashboard-courses-list-item-property'>
                                            <Icon variant='subtle' name='check' className='dashboard-courses-list-item-property-icon'/> 
                                            Category: 
                                            {course.categories.map((category, index) => <span key={index}>{index !== 0 ? ', ' : ' '}<a href='/#'>{category}</a></span>)}
                                        </div>
                                        <div className='dashboard-courses-list-item-property'>
                                            <Icon variant='subtle' name='check' className='dashboard-courses-list-item-property-icon'/> 
                                            Tag:
                                            {course.tags.map((tag, index) => <span key={index}>{index !== 0 ? ', ' : ' '}<a href='/#'>{tag}</a></span>)}
                                        </div>
                                        <div className='dashboard-courses-list-item-property'>
                                            <Icon variant='subtle' name='status-pending' className='dashboard-courses-list-item-property-icon'/> 
                                            {Math.floor(course.length / 60) > 0 ? Math.floor(course.length / 60) + " hours " : ""}
                                            {course.length % 60 > 0 ? course.length % 60 + " minutes" : ""}
                                        </div>
                                        <div className='dashboard-courses-list-item-desc'>
                                            {course.description}
                                        </div>
                                    </div>
                                    <div className='dashboard-courses-list-item-thumbnail'>
                                        <img src={courseDefaultThumbnail} alt='Course Thumbnail'/>
                                    </div>
                                    <div className='dashboard-courses-list-item-separator' />
                                    <div className='dashboard-courses-list-item-action'>
                                        <Button variant="primary" className='btn-orange' onClick={() => this.redirectToCourse(course.id)}>
                                            Get Started <Icon name='arrow-left' className='rotate-180' />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <Footer />
            </div>;
    }
}