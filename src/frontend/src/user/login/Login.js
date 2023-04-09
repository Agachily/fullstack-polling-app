import {Form, Input, Button, notification} from 'antd';
import { useState } from 'react'
import {login} from "../../util/APIUtils";
import {ACCESS_TOKEN} from "../../constants/constant";
import {LockOutlined, UserOutlined} from "@ant-design/icons";
import './Login.css';
import {Link} from "react-router-dom";

const FormItem = Form.Item;

const Login = ({handleLogin}) => {
    const [userInfo, setUserInfo] = useState({
        usernameOrEmail: {},
        password: {}
    })

    const handleSubmit = () => {
        const loginRequest = {
            usernameOrEmail: userInfo.usernameOrEmail,
            password: userInfo.password
        }

        login(loginRequest).then(response => {
            localStorage.setItem(ACCESS_TOKEN, response.data.accessToken)
            handleLogin()
        }).catch(error => {
            if (error.response.status && error.response.status === 401) {
                notification.error({
                    message: 'Polling App',
                    description: 'Invalid credentials'
                })
            } else {
                notification.error({
                    message: 'Polling App',
                    description: error.message || 'Sorry! Something went wrong. Please try again'
                })
            }
        })
    }

    const handleInputChange = (event) => {
        const target = event.target
        const inputName = target.name
        const inputValue = target.value

        setUserInfo({
            ...userInfo,
            [inputName]: inputValue
        })
    }

    return (
        <div className="login-container">
            <h1 className="page-title">Login</h1>
            <div className="signup-content">
                <Form onFinish={handleSubmit} layout='vertical' className="signup-form">
                    <FormItem>
                        <Input prefix={<UserOutlined />}
                               size="large"
                               name='usernameOrEmail'
                               palceholder="Username or Email"
                               value={userInfo.usernameOrEmail.value}
                               onChange={handleInputChange}/>
                    </FormItem>
                    <FormItem>
                        <Input prefix={<LockOutlined />}
                               size="large"
                               name='password'
                               type='password'
                               palceholder="Password"
                               value={userInfo.password.value}
                               onChange={handleInputChange}/>
                    </FormItem>
                    <FormItem>
                        <Button type="primary"
                                htmlType="submit"
                                size="large"
                                className="signup-form-button">Login</Button>
                        Or
                        <Link to="/signup"> register now!</Link>
                    </FormItem>
                </Form>
            </div>
        </div>
    )
}

export default Login