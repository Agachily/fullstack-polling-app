import {Form, Input, Button, notification} from 'antd';
import {Link, useNavigate} from 'react-router-dom';
import './Signup.css';
import {useState} from "react";
import {
    NAME_MIN_LENGTH, NAME_MAX_LENGTH,
    USERNAME_MIN_LENGTH, USERNAME_MAX_LENGTH,
    EMAIL_MAX_LENGTH,
    PASSWORD_MIN_LENGTH, PASSWORD_MAX_LENGTH
} from '../../constants/constant';
import {checkEmailAvailability, checkUsernameAvailability, signup} from "../../util/APIUtils";
import {LockOutlined, MailOutlined, QuestionCircleOutlined} from "@ant-design/icons";

const FormItem = Form.Item

const Signup = () => {
    const navigate = useNavigate()
    const [userInfo, setUserInfo] = useState({
        name: {value: ''},
        username: {value: ''},
        email: {value: ''},
        password: {value: ''}
    })

    const handleInputChange = (event, validationFun) => {
        const target = event.target;
        const inputName = target.name;
        const inputValue = target.value;

        setUserInfo({
            ...userInfo,
            [inputName]: {
                value: inputValue,
                ...validationFun(inputValue)
            }
        })
    }

    const handleSubmit = (event) => {
        const signupRequest = {
            name: userInfo.name.value,
            username: userInfo.username.value,
            email: userInfo.email.value,
            password: userInfo.password.value
        }

        signup(signupRequest).then(response => {
            notification.success({
                message: 'Polling App',
                description: "Thanks! You're successfully registered. Please Login to continue!"
            })
            navigate('/login')
        }).catch(error => {
            notification.error({
                message: 'Polling App',
                description: error.message || 'Sorry! Something went wrong. Please try again!'
            })
        })
    }

    const validateName = (name) => {
        if (name.length < NAME_MIN_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: `Name is too short (Minimum ${NAME_MIN_LENGTH} characters needed.)`
            }
        } else if (name.length > NAME_MAX_LENGTH) {
            return {
                validationStatus: 'error',
                errorMsg: `Name is too long (Maximum ${NAME_MAX_LENGTH} characters allowed.)`
            }
        } else {
            return {
                validateStatus: 'success',
                errorMsg: null,
            }
        }
    }

    const validateUsername = (username) => {
        if (username.length < USERNAME_MIN_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: `Username is too short (Minimum ${USERNAME_MIN_LENGTH} characters needed.)`
            }
        } else if (username.length > USERNAME_MAX_LENGTH) {
            return {
                validationStatus: 'error',
                errorMsg: `Username is too long (Maximum ${USERNAME_MAX_LENGTH} characters allowed.)`
            }
        } else {
            return {
                validateStatus: null,
                errorMsg: null
            }
        }
    }

    const validateUsernameAvailability = () => {
        const usernameValue = userInfo.username.value
        const usernameValidation = validateUsername(usernameValue)

        if (usernameValidation.validateStatus === 'error') {
            setUserInfo({
                ...userInfo,
                username: {
                    value: usernameValue,
                    ...usernameValidation
                }
            })
            return
        }

        setUserInfo({
            ...userInfo,
            username: {
                value: usernameValue,
                validateStatus: 'validating',
                errorMsg: null
            }
        })

        checkUsernameAvailability(usernameValue).then(response => {
            if (response.data.available) {
                setUserInfo({
                    ...userInfo,
                    username: {
                        value: usernameValue,
                        validateStatus: 'success',
                        errorMsg: null
                    }
                })
            } else {
                setUserInfo({
                    ...userInfo,
                    username: {
                        value: usernameValue,
                        validateStatus: 'error',
                        errorMsg: 'This username is already taken'
                    }
                })
            }
        }).catch(error => {
            setUserInfo({
                ...userInfo,
                username: {
                    value: usernameValue,
                    validateStatus: 'success',
                    errorMsg: null
                }
            })
        })
    }

    const validateEmail = (email) => {
        if (!email) {
            return {
                validateStatus: 'error',
                errorMsg: 'Email may not be empty'
            }
        }

        const EMAIL_REGEX = RegExp('[^@ ]+@[^@ ]+\\.[^@ ]+');
        if (!EMAIL_REGEX.test(email)) {
            return {
                validateStatus: 'error',
                errorMsg: 'Email is not valid'
            }
        }

        if (email.length > EMAIL_MAX_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: `Email is too long (Maximum ${EMAIL_MAX_LENGTH} characters allowed)`
            }
        }

        return {
            validateStatus: 'success',
            errorMsg: null
        }
    }

    const validateEmailAvailability = () => {
        const emailValue = userInfo.email.value
        const emailValidation = validateEmail(emailValue)

        if (emailValidation.validateStatus === 'error') {
            setUserInfo({
                ...userInfo,
                email: {
                    value: emailValue,
                    ...emailValidation
                }
            })
            return
        }

        setUserInfo({
            ...userInfo,
            email: {
                value: emailValue,
                validateStatus: 'validating',
                errorMsg: null
            }
        })

        checkEmailAvailability(emailValue).then(response => {
            if (response.data.available) {
                setUserInfo({
                    ...userInfo,
                    email: {
                        value: emailValue,
                        validateStatus: 'success',
                        errorMsg: null
                    }
                })
            } else {
                setUserInfo({
                    ...userInfo,
                    email: {
                        value: emailValue,
                        validateStatus: 'error',
                        errorMsg: 'This Email is already registered'
                    }
                })
            }
        }).catch(error => {
            setUserInfo({
                ...userInfo,
                /*  Marking validateStatus as success, Form will be rechecked at server */
                username: {
                    value: emailValue,
                    validateStatus: 'success',
                    errorMsg: null
                }
            })
        })
    }

    const validatePassword = (password) => {
        if (password.length < PASSWORD_MIN_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: `Password is too short (Minimum ${PASSWORD_MIN_LENGTH} characters needed.)`
            }
        } else if (password.length > PASSWORD_MAX_LENGTH) {
            return {
                validationStatus: 'error',
                errorMsg: `Password is too long (Maximum ${PASSWORD_MAX_LENGTH} characters allowed.)`
            }
        } else {
            return {
                validateStatus: 'success',
                errorMsg: null,
            };
        }
    }

    const isFormInvalid = () => {
        return !(
            userInfo.name.validateStatus === 'success' &&
            userInfo.username.validateStatus === 'success' &&
            userInfo.email.validateStatus === 'success' &&
            userInfo.password.validateStatus === 'success'
        )
    }

    return (
        <div className="signup-container">
            <h1 className="page-title">Sign Up</h1>
            <div className="signup-content">
                <Form onFinish={handleSubmit} className="signup-form" layout='vertical'>
                    {/* help is used to set the message for validation, validateStatus is used to set validate status */}
                    <FormItem label="Full Name" validateStatus={userInfo.name.validateStatus}
                              help={userInfo.name.errorMsg}>
                        <Input prefix={<QuestionCircleOutlined/>}
                               size="large"
                               name="name"
                               autoComplete="off"
                               value={userInfo.name.value}
                               onBlur={validateUsernameAvailability}
                               onChange={(event) => handleInputChange(event, validateName)}/>
                    </FormItem>
                    <FormItem label="Username" validateStatus={userInfo.username.validateStatus}
                              help={userInfo.username.errorMsg}>
                        <Input prefix={<QuestionCircleOutlined/>}
                               size="large"
                               name="username"
                               autoComplete="off"
                               value={userInfo.username.value}
                               onBlur={validateUsernameAvailability}
                               onChange={(event) => handleInputChange(event, validateUsername)}/>
                    </FormItem>
                    <FormItem label="Email" validateStatus={userInfo.email.validateStatus}
                              help={userInfo.email.errorMsg}>
                        <Input prefix={<MailOutlined/>}
                               size="large"
                               name="email"
                               type="email"
                               autoComplete="off"
                               value={userInfo.email.value}
                               onBlur={validateEmailAvailability}
                               onChange={(event) => handleInputChange(event, validateEmail)}/>
                    </FormItem>
                    <FormItem label="Password" validateStatus={userInfo.password.validateStatus}
                              help={userInfo.password.errorMsg}>
                        <Input prefix={<LockOutlined/>}
                               size="large"
                               name="password"
                               type="password"
                               autoComplete="off"
                               placeholder="A password between 6 to 20 characters"
                               value={userInfo.password.value}
                               onChange={(event) => handleInputChange(event, validatePassword)}/>
                    </FormItem>
                    <FormItem>
                        <Button type="primary"
                                htmlType="submit"
                                size="large"
                                className="signup-form-button"
                                disabled={isFormInvalid()}>Sign up</Button>
                        Already Registered?
                        <Link to="/login"> Login Now!</Link>
                    </FormItem>
                </Form>
            </div>
        </div>
    )
}

export default Signup