import {useState, useEffect} from 'react'
import {Button, notification} from "antd";
import LoadingIndicator from '../common/LoadingIndicator';
import {POLL_LIST_SIZE} from "../constants/constant";
import {useNavigate} from 'react-router-dom'
import {castVote, getAllPolls, getUserCreatedPolls, getUserVotedPolls} from "../util/APIUtils";
import Poll from "./Poll";
import './PollList.css'
import {PlusCircleOutlined} from "@ant-design/icons";

const PollList = ({username, type, isAuthenticated, handleLogout}) => {
    const navigate = useNavigate()
    const [pollListInfo, setPollListInfo] = useState({
        polls: [],
        page: 0,
        size: 10,
        totalElements: 0,
        totalPages: 0,
        last: true,
        currentVotes: [],
        isLoading: false
    })

    const loadPollList = (page = 0, size = POLL_LIST_SIZE) => {
        let promise
        if (username) {
            if (type === 'USER_CREATED_POLLS') {
                promise = getUserCreatedPolls(username, page, size)
            } else if (type === 'USER_VOTED_POLLS') {
                promise = getUserVotedPolls(username, page, size)
            }
        } else {
            promise = getAllPolls(page, size)
        }

        if (!promise) {
            return;
        }

        setPollListInfo({
            ...pollListInfo,
            isLoading: true
        })

        promise.then(response => {
            const polls = pollListInfo.polls.slice()
            const currentVotes = pollListInfo.currentVotes.slice()

            setPollListInfo({
                ...pollListInfo,
                polls: polls.concat(response.data.content),
                page: response.data.page,
                size: response.data.size,
                totalElements: response.data.totalElements,
                totalPages: response.data.totalElements,
                last: response.data.last,
                currentVotes: currentVotes.concat(Array(response.data.content.length).fill(null)),
                isLoading: false
            })
        }).catch(error => {
            setPollListInfo({
                ...pollListInfo,
                isLoading: false
            })
        })
    }

    const handleLoadMore = () => {
        loadPollList(pollListInfo.page + 1)
    }

    const handleVoteChange = (event, pollIndex) => {
        const currentVotes = pollListInfo.currentVotes.slice()
        currentVotes[pollIndex] = event.target.value

        setPollListInfo({
            ...pollListInfo,
            currentVotes: currentVotes
        })
    }

    const handleVoteSubmit = (event, pollIndex) => {
        event.preventDefault()
        if (!isAuthenticated) {
            navigate('/login')
            notification.info({
                message: 'Polling App',
                description: "Please login to vote.",
            })
            return
        }

        const poll = pollListInfo.polls[pollIndex]
        const selectedChoice = pollListInfo.currentVotes[pollIndex]

        const voteDate = {
            pollId: poll.id,
            choiceId: selectedChoice
        }

        castVote(voteDate).then(response => {
            const polls = pollListInfo.polls.slice()
            polls[pollIndex] = response.data

            setPollListInfo({
                ...pollListInfo,
                polls: polls
            })
        }).catch(error => {
            if (error.status === 401) {
                handleLogout('/login', 'error', 'You have been logged out. Please login to vote');
            } else {
                notification.error({
                    message: 'Polling App',
                    description: error.message || 'Sorry! Something went wrong. Please try again!'
                });
            }
        })
    }

    useEffect(loadPollList, [])
    const pollViews = []
    pollListInfo.polls.forEach((poll, pollIndex) => {
        pollViews.push(<Poll key={poll.id}
                             poll={poll}
                             currentVote={pollListInfo.currentVotes[pollIndex]}
                             handleVoteChange={(event) => handleVoteChange(event, pollIndex)}
                             handleVoteSubmit={(event) => handleVoteSubmit(event, pollIndex)}/>)
    })


    return (
        <div className="polls-container">
            {pollViews}
            {
                !pollListInfo.isLoading && pollListInfo.polls.length === 0 ? (
                    <div className="no-polls-found">
                        <span>No Polls Found</span>
                    </div>
                ) : null
            }
            {
                !pollListInfo.isLoading && !pollListInfo.last ? (
                    <div className="load-more-polls">
                        <Button type="dashed" onClick={handleLoadMore} disabled={pollListInfo.isLoading}>
                            <PlusCircleOutlined/> Load more
                        </Button>
                    </div>) : null
            }
            {
                pollListInfo.isLoading ? <LoadingIndicator/> : null
            }
        </div>
    )
}

export default PollList