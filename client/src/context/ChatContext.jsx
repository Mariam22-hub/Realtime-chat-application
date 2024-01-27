import { createContext, useState, useEffect, useCallback } from "react";
import { baseURL, getRequest, postRequest } from "../utils/services";
import { Prev } from "react-bootstrap/esm/PageItem";

export const ChatContext = createContext()

export const ChatContextProvider = ({children, user}) => {
    const [userChats, setUserChats] = useState(null)
    const [isUserChatsLoading, setIsUserChatsLoading] = useState(false)
    const [userChatsError, isUserChatsError] = useState(null)
    const [potentialChats, setPotentialChats] = useState([null])
    const [currentChat, setCurrentChat] = useState(null)
    const [messages, setMessages] = useState(null)
    const [messagesError, setMessagesError] = useState(null)
    const [isMessagesLoading, setMessagesLoading] = useState(null)

    console.log("messages", messages)
    
    useEffect(()=>{
         const getUsers = async ()=>{
            const response = await getRequest(`${baseURL}/users`)
            
            if (response.error){
                return console.log("error fetching users", response.error)
            }
            const pChats = response.filter((u) => {
                let isChatCreated = false
                if (user?._id === u._id) return false

                if (userChats){
                    isChatCreated = userChats?.some((chat)=>{
                        return chat.member[0] === u._id || chat.member[1] === u._id
                    })
                }
                return !isChatCreated
            })
            setPotentialChats(pChats)
         }
         getUsers()
         
    }, [userChats])

    
    const createChat = useCallback(async (first_id, second_id) => {
        const response = await postRequest(`${baseURL}/chats`, JSON.stringify(first_id, second_id))
        if (response.error) return console.log("error occured")

        setUserChats((prev) => [...prev, response])
    }, [])

    useEffect(()=>{
        const getUserChats = async()=>{
            if (user?._id){
                setIsUserChatsLoading(true)
                isUserChatsError(null)

                const response = await getRequest(`${baseURL}/chats/${user?._id}`)
                
                setIsUserChatsLoading(false)

                if (response.error){
                    return isUserChatsError(response)
                }

                setUserChats(response)
            }
        }
        getUserChats()
    }, [user])

    const updateCurrentChat = useCallback((chat)=>{
        setCurrentChat(chat)
    })

        useEffect(()=>{
        const getMessages = async()=>{
            if (user?._id){
                setMessagesLoading(true)
                setMessagesError(null)

                const response = await getRequest(`${baseURL}/messages/${currentChat?._id}`)
                
                setMessagesLoading(false)

                if (response.error){
                    return setMessagesError(response)
                }

                setMessages(response)
            }
        }
        getMessages()
    }, [currentChat])

    return <ChatContext.Provider value={{
        userChats,
        isUserChatsLoading,
        userChatsError,
        potentialChats,
        createChat,
        updateCurrentChat,
        messages,
        isMessagesLoading,
        messagesError
    }}>{children}</ChatContext.Provider>
}