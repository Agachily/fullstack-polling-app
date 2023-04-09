import { Layout, Menu, Dropdown} from 'antd';
import {Link} from "react-router-dom"
import './AppHeader.css'
import {BarChartOutlined, HomeOutlined, UserOutlined} from "@ant-design/icons";

const Header = Layout.Header;
const Item = Menu.Item

const AppHeader = ({onlogout, currentUser}) => {
    const handleMenuClick = ({key}) => {
        if (key === "logout") {
            onlogout()
        }
    }

    let menuItems
    if (currentUser.username !== '') {
        menuItems = [
            <Item key="/">
                <Link to="/">
                    <HomeOutlined style={{ fontSize: '130%'}}/>
                </Link>
            </Item>,
            <Item key="/poll/new">
                <Link to="/poll/new">
                    <BarChartOutlined style={{ fontSize: '130%'}}/>
                </Link>
            </Item>,
            <Item key="/profile" className="profile-menu">
                <ProfileDropdownMenu currentUser={currentUser} handleMenuClick={handleMenuClick}/>
            </Item>
        ]
    } else {
        menuItems = [
            <Item key="/login">
                <Link to="/login">Login</Link>
            </Item>,
            <Item key="/signup">
                <Link to="/signup">Signup</Link>
            </Item>
        ]
    }

    return (
        <Header className="app-header" theme="light">
            <div className="container">
                <div className="app-title">
                    <Link to="/">Polling App</Link>
                </div>
                <Menu theme="light"
                      mode="horizontal"
                      style={{lineHeight: '64px', fontSize: '17px', paddingLeft: '750px'}}>
                    {menuItems}
                </Menu>
            </div>
        </Header>
    )
}

const ProfileDropdownMenu = ({handleMenuClick, currentUser}) => {
    const dropdownMenu = (
        <Menu onClick={handleMenuClick} className="profile-dropdown-menu">
            <Item key="user-info" className="dropdown-item" disabled>
                <div className="user-full-name-info">
                    {currentUser.name}
                </div>
                <div className="username-info">
                    @{currentUser.username}
                </div>
            </Item>
            <Menu.Divider />
            <Item key="profile" className="dropdown-item">
               <Link to={`/user/${currentUser.username}`}>Profile</Link>
            </Item>
            <Item key="logout" className="dropdown-item">
                Logout
            </Item>
        </Menu>
    )

    return (
        <Dropdown overlay={dropdownMenu} trigger={['click']}
                  getPopupContainer = { () => document.getElementsByClassName('profile-menu')[0]}>
            <a className="ant-dropdown-link">
                <UserOutlined style={{ fontSize: '130%'}}/>
            </a>
        </Dropdown>
    )
}

export default AppHeader

