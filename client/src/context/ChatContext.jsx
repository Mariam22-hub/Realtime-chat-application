import { createContext, useState, useEffect } from "react";
import { baseURL, getRequest, postRequest } from "../utils/services";

export const ChatContext = createContext()

export const ChatContextProvider = ({children, user}) => {
    const [userChats, setUserChats] = useState(null)
    const [isUserChatsLoading, setIsUserChatsLoading] = useState(false)
    const [userChatsError, isUserChatsError] = useState(null)
    const [potentialChats, setPotentialChats] = useState([null])

    // useEffect(()=>{
    //      const getUsers = async ()=>{
    //         const response = await getRequest(`${baseURL}/users`)
            
    //         if (response.error){
    //             return console.log("error fetching users", response.error)
    //         }
    //         const pChats = response.filter((u) => {
    //             let isChatCreated = false
    //             if (user._id === u._id) return false

    //             if (userChats){
    //                 isChatCreated = userChats?.some((chat)=>{
    //                     return chat.member[0] === u._id || chat.member[1] === u._id
    //                 })
    //             }
    //             return !isChatCreated
    //         })
    //         setPotentialChats(pChats)
    //      }
    //      getUsers()
         
    // }, [userChats])

    useEffect(()=>{
        const getUserChats = async()=>{
            if (user?._id){
                setIsUserChatsLoading(true)

                const response = await getRequest(`${baseURL}/chats/${user?._id}`)
                
                setIsUserChatsLoading(false)
                isUserChatsError(null)

                if (response.error){
                    return setIsUserChatsLoading(response)
                }

                setUserChats(response)
                
            }
        }
        getUserChats()
    }, [user])

    return <ChatContext.Provider value={{
        userChats,
        isUserChatsLoading,
        userChatsError,
        // potentialChats,
    }}>{children}</ChatContext.Provider>
}