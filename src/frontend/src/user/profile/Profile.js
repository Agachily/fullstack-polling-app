import {Avatar, Tabs} from 'antd';
import './Profile.css'
import { useState, useEffect} from 'react'
import {formatDate} from "../../util/Helpers";
import {getUserProfile} from "../../util/APIUtils";
import LoadingIndicator from "../../common/LoadingIndicator";
import NotFound from "../../common/NotFound";
import ServerError from "../../common/ServerError";
import {getAvatarColor} from "../../util/Color";
import PollList from "../../poll/PollList";

const TabPane = Tabs.TabPane;

const Profile = ({username}) => {

    const [user, setUser] = useState({
        user: null,
        isLoading: false
    })

    const loadUserProfile = (username) => {
        setUser({
            ...user,
            isLoading: true
        })

        getUserProfile(username).then(response => {
            setUser({
                ...user,
                user: response.data,
                isLoading: false
            })
        }).catch(error => {
            if (error.response.status === 404) {
                setUser({
                    ...user,
                    notFound: true,
                    isLoading: false
                });
            } else {
                setUser({
                    ...user,
                    serverError: true,
                    isLoading: false
                });
            }
        })
    }

    useEffect(() => loadUserProfile(username), [])

    if (user.isLoading) {
        return <LoadingIndicator/>
    }

    if (user.notFound) {
        return <NotFound/>
    }

    if (user.serverError) {
        return <ServerError/>
    }

    return (
        <div className="profile">
            {
                user.user ? (
                    <div className="user-profile">
                        <div className="user-details">
                            <div className="user-avatar">
                                <Avatar className="user-avatar-circle"
                                        style={{backgroundColor: getAvatarColor(user.user.name)}}>
                                    {user.user.name[0].toUpperCase()}
                                </Avatar>
                            </div>
                            <div className="user-summary">
                                <div className="full-name">{user.user.name}</div>
                                <div className="username">@{user.user.username}</div>
                                <div className="user-joined">Joined {formatDate(user.user.joinedAt)}</div>
                            </div>
                        </div>
                        <div className="user-poll-details">
                            <Tabs defaultActiveKey="1"
                                  animated={false}
                                  tabBarStyle={{textAlign: "center"}}
                                  size="large"
                                  className="profile-tabs">
                                <TabPane tab={`${user.user.pollCount} Polls`} key="1">
                                    <PollList username={user.user.username} type="USER_CREATED_POLLS"/>
                                </TabPane>
                                <TabPane tab={`${user.user.voteCount} Votes`} key="2">
                                    <PollList username={user.user.username} type="USER_VOTED_POLLS"/>
                                </TabPane>
                            </Tabs>
                        </div>
                    </div>
                ) : null
            }
        </div>
    )
}

export default Profile