import {Form, Input, Button, Select, Col, notification, Row} from 'antd';
import {MAX_CHOICES, POLL_QUESTION_MAX_LENGTH, POLL_CHOICE_MAX_LENGTH} from '../constants/constant'
import {useNavigate} from 'react-router-dom'
import { useState } from 'react'
import PollChoice from "./PollChoice"
import {createPoll} from "../util/APIUtils"
import './NewPoll.css';
import {PlusCircleOutlined} from "@ant-design/icons"

const Option = Select.Option
const FormItem = Form.Item
const {TextArea} = Input

const NewPoll = ({handleLogout}) => {
    const navigate = useNavigate()

    const [pollInfo, setPollInfo] = useState({
        question: {},
        choices: [
            /* Initially there are  two choices */
            {text: ''}, {text: ''}
        ],
        pollLength: {
            days: 1,
            hours: 0
        }
    })

    const addChoice = () => {
        const choices = pollInfo.choices.slice()
        setPollInfo({
            ...pollInfo,
            choices: choices.concat([{text: ''}])
        })
    }

    const removeChoice = (choiceNumber) => {
        const choices = pollInfo.choices.slice();
        setPollInfo({
            ...pollInfo,
            /* Remove the Xth choice and concat the choices before and after it*/
            choices: [...choices.slice(0, choiceNumber), ...choices.slice(choiceNumber + 1)]
        })
    }

    const handleSubmit = () => {
        const pollData = {
            question: pollInfo.question.text,
            choices: pollInfo.choices.map(choice => {
                return {text: choice.text}
            }),
            pollLength: pollInfo.pollLength
        }

        createPoll(pollData).then(response => {
            navigate('/')
        }).catch(error => {
            if (error.status === 401) {
                handleLogout('/login', 'error', 'You have been logged out. Please login to create a poll.')
            } else {
                notification.error({
                    message: 'Polling App',
                    description: error.message || 'Sorry! Something went wrong. Please try again!'
                });
            }
        })
    }

    const validateQuestion = (questionText) => {
        if (questionText.length === 0) {
            return {
                validateStatus: 'error',
                errorMsg: 'Please enter your question!'
            }
        } else if (questionText.length > POLL_QUESTION_MAX_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: `Question is too long (Maximum ${POLL_QUESTION_MAX_LENGTH} characters allowed)`
            }
        } else {
            return {
                validateStatus: 'success',
                errorMsg: null
            }
        }
    }

    const handleQuestionChange = (event) => {
        const value = event.target.value
        setPollInfo({
            ...pollInfo,
            question: {
                text: value,
                ...validateQuestion(value)
            }
        })
    }

    const validateChoice = (choiceText) => {
        if (choiceText.length === 0) {
            return {
                validateStatus: 'error',
                errorMsg: 'Please enter a choice!'
            }
        } else if (choiceText.length > POLL_CHOICE_MAX_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: `Choice is too long (Maximum ${POLL_CHOICE_MAX_LENGTH} characters allowed)`
            }
        } else {
            return {
                validateStatus: 'success',
                errorMsg: null
            }
        }
    }

    const handleChoiceChange = (event, index) => {
        const choices = pollInfo.choices.slice()
        const value = event.target.value

        choices[index] = {
            text: value,
            ...validateChoice(value)
        }

        setPollInfo({
            ...pollInfo,
            choices: choices
        })
    }

    const handlePollDaysChange = (value) => {
        const pollLength = Object.assign(pollInfo.pollLength, {days: value});
        setPollInfo({
            ...pollInfo,
            pollLength: pollLength
        });
    }

    const handlePollHoursChange = (value) => {
        const pollLength = Object.assign(pollInfo.pollLength, {hours: value});
        setPollInfo({
            ...pollInfo,
            pollLength: pollLength
        });
    }

    const isFormInvalid = () => {
        if (pollInfo.question.validateStatus !== 'success')
            return true

        for (let i = 0; i < pollInfo.choices.length; i++) {
            const choice = pollInfo.choices[i]
            if (choice.validateStatus !== 'success')
                return true
        }
    }

    const choiceViews = []
    pollInfo.choices.forEach((choice, index) => {
        choiceViews.push(
            <PollChoice key={index} choice={choice} choiceNumber={index} removeChoice={removeChoice}
                        handleChoiceChange={handleChoiceChange}/>
        )
    })

    return (
        <div className="new-poll-container">
            <h1 className="page-title">Create Poll</h1>
            <div className="new-poll-content">
                <Form onFinish={handleSubmit} className="create-poll-form">
                    <FormItem validateStatus={pollInfo.question.validateStatus} help={pollInfo.question.errorMsg}
                              className="poll-form-row">
                        <TextArea
                            placeholder="Enter your poll question"
                            style={{fontSize: '16px'}}
                            autosize={{minRows: 3, maxRows: 6}}
                            name="question"
                            value={pollInfo.question.text}
                            onChange={handleQuestionChange}/>
                    </FormItem>
                    {choiceViews}
                    <FormItem className="poll-form-row">
                        <Button type="dashed" onClick={addChoice} disabled={pollInfo.choices.length === MAX_CHOICES}>
                            <PlusCircleOutlined /> Add a choice
                        </Button>
                    </FormItem>
                    <FormItem className="poll-form-row">
                        <Row>
                        <Col xs={24} sm={4} style={{marginTop: "5px"}}>Valid Time:</Col>
                        <Col xs={24} sm={20}>
                            <span style={{marginRight: '18px'}}>
                                <Select name="days"
                                        defaultValue="1"
                                        onChange={handlePollDaysChange}
                                        value={pollInfo.pollLength.days}
                                        style={{width: 60}}>
                                    {Array.from(Array(8).keys()).map(i => <Option key={i}>{i}</Option>)}
                                </Select> &nbsp;Days
                            </span>
                            <span>
                                <Select name="hours"
                                        defaultValue="0"
                                        onChange={handlePollHoursChange}
                                        value={pollInfo.pollLength.hours}
                                        style={{width: 60}}>
                                    {Array.from(Array(24).keys()).map(i => <Option key={i}>{i}</Option>)}
                                </Select> &nbsp;Hours
                            </span>
                        </Col>
                        </Row>
                    </FormItem>
                    <FormItem className="poll-form-row">
                        <Button type="primary" htmlType="submit" size="large" disabled={isFormInvalid()}
                                className="create-poll-form-buttom">Create Poll</Button>
                    </FormItem>
                </Form>
            </div>
        </div>
    )
}

export default NewPoll