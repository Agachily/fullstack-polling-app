import './App.css';
import {Layout, notification} from 'antd';
import React, {useState, useEffect} from 'react';
import Signup from "./user/signup/Signup";
import {Route, Routes, useNavigate} from "react-router-dom";
import AppHeader from "./common/AppHeader";
import {Content} from "antd/es/layout/layout";
import PollList from "./poll/PollList";
import Login from "./user/login/Login";
import Profile from "./user/profile/Profile";
import NewPoll from "./poll/NewPoll";
import NotFound from "./common/NotFound";
import {getCurrentUser} from "./util/APIUtils";
import {ACCESS_TOKEN} from "./constants/constant";
import LoadingIndicator from "./common/LoadingIndicator";
import PrivateRoute from "./common/PrivateRoute";

const App = () => {
    const navigate = useNavigate()
    const [appInfo, setAppInfo] = useState({
        currentUser: {
            username: ''
        },
        isAuthenticated: false,
        isLoading: true
    })

    notification.config({
        placement: 'topRight',
        top: 70,
        duration: 3,
    })

    const loadCurrentUSer = () => {
        getCurrentUser().then(response => {
            setAppInfo({
                ...appInfo,
                currentUser: response.data,
                isAuthenticated: true,
                isLoading: false
            })
        }).catch(error => {
            setAppInfo({
                ...appInfo,
                isLoading: false
            })
        })
    }

    const handleLogout = (redirectTo="/", notificationType="success", description="You're successfully logged out.") => {
        localStorage.removeItem(ACCESS_TOKEN)
        setAppInfo({
            ...appInfo,
            currentUser: {username: ''},
            isAuthenticated: false
        })
        navigate(redirectTo)
        notification[notificationType]({
            message: 'Polling App',
            description: description,
        })
    }

    const handleLogin = () => {
        notification.success({
            message: 'Polling App',
            description: "You're successfully logged in.",
        })
        loadCurrentUSer()
        navigate("/")
    }

    useEffect(loadCurrentUSer, [])

    if (appInfo.isLoading) {
        return <LoadingIndicator/>
    }

    return (
        <Layout className="app-container">
            <AppHeader isAuthenticated={appInfo.isAuthenticated}
                       currentUser={appInfo.currentUser} onlogout={handleLogout}/>

            <Content className="app-content">
                <div className="container">
                    <Routes>
                        <Route path="/" element={<PollList isAuthenticated={appInfo.isAuthenticated} currentUser={appInfo.currentUser} handleLogout={handleLogout}/>}/>
                        <Route path="/login" element={<Login handleLogin={handleLogin} />}/>
                        <Route path="/signup" element={<Signup/>}/>
                        <Route path="/user/:username" element={<Profile username={appInfo.currentUser.username}/>}/>
                        <Route path="/poll/new" element={<PrivateRoute isAuthenticated={appInfo.isAuthenticated} child={<NewPoll handleLogout={handleLogout}/>}/>}></Route>
                        <Route path="/*" element={<NotFound/>}/>
                    </Routes>
                </div>
            </Content>
        </Layout>
    )
}

export default App;
