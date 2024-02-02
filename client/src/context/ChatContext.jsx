import { createContext, useState, useEffect, useCallback } from "react";
import { baseURL, getRequest, postRequest } from "../utils/services";
import { Prev } from "react-bootstrap/esm/PageItem";
import {io} from "socket.io-client"

export const ChatContext = createContext()

export const ChatContextProvider = ({children, user}) => {
    const [userChats, setUserChats] = useState(null)
    const [isUserChatsLoading, setIsUserChatsLoading] = useState(false)
    const [userChatsError, setUserChatsError] = useState(null)
    const [potentialChats, setPotentialChats] = useState([null])
    const [currentChat, setCurrentChat] = useState(null)
    const [messages, setMessages] = useState(null)
    const [messagesError, setMessagesError] = useState(null)
    const [isMessagesLoading, setMessagesLoading] = useState(null)
    const [sendTextError, setSendTextError] = useState(null)
    const [newMessage, setNewMessage] = useState(null)
    const [socket, setSocket] = useState(null)
    const [onlineUsers, setOnlineUsers] = useState([])

    console.log("messages", messages)
    console.log("new messages", newMessage)

    useEffect(()=>{
        const newSocket = io("http://localhost:3000")
        setSocket(newSocket)

        return ()=> {newSocket.disconnect()}

    }, [user])

    useEffect(()=>{
        if (socket === null) return console.log("no socket server started")
        socket.emit("addNewUser", user?._id)
        socket.on("getOnlineUsers", (res)=>{
            setOnlineUsers(res) 
        })

        return () => socket.off("getOnlineUsers")
    }, [socket])


    // send a message
    useEffect(()=>{
        if (socket === null) return console.log("no socket server started")
        const recepientId = currentChat?.members?.find((id) => id !== user?._id)

        socket.emit("sendMessage", {...newMessage,recepientId})

        return () => socket.off("getOnlineUsers")
    }, [newMessage])


    // recieve message
    useEffect(()=>{
        if (socket === null) return console.log("no socket server started")
        socket.on("getMessage", (res)=>{
            if (currentChat?._id != res.chatId) return

            setMessages((prev)=>[...prev, res])
        })

        return () => socket.off("getMessage")
    }, [socket, currentChat])

    
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


    const sendTextMessage = useCallback(async (textMessage, sender, currentChatId, setTextMessage) => {
        if (!textMessage) return console.log("You must type something")  
        
        const response = await postRequest(
            `${baseURL}/messages`,
            JSON.stringify({
                chatId: currentChatId,
                senderId: sender._id,
                text: textMessage
            })
        )

        if (response.error){
            return setSendTextError(response.error)
        }

        setNewMessage(textMessage)
        setMessages((prev) => [...prev, response])
        setTextMessage("")
    },[])

    
    const createChat = useCallback(async (first_id, second_id) => {
        const response = await postRequest(`${baseURL}/chats`, JSON.stringify(first_id, second_id))
        if (response.error) return console.log("error occured")

        setUserChats((prev) => [...prev, response])
    }, [])


    useEffect(()=>{
        const getUserChats = async()=>{
            if (user?._id){
                setIsUserChatsLoading(true)
                setUserChatsError(null)

                const response = await getRequest(`${baseURL}/chats/${user?._id}`)
                
                setIsUserChatsLoading(false)

                if (response.error){
                    return setUserChatsError(response)
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
        messagesError,
        sendTextMessage,
        sendTextError,
        onlineUsers
    }}>{children}</ChatContext.Provider>
}