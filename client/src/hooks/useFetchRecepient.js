import { useEffect, useState } from "react";
import { baseURL, getRequest } from "../utils/services";

export const useFetchRecepient = (chat, user) =>{
    const [recipientUser, setRecipientUser] = useState(null)
    const [setError, isRecipientError] = useState(null)

    const recepientId = chat?.members.find((id) => id !== user._id)
    useEffect(()=>{
        const getUser = async()=>{
            if (!recepientId) return null
            const response = await getRequest(`${baseURL}/users/find/${recepientId}`)

            if (response.error){
                return setError(response.error)
            }
            setRecipientUser(response)
        }
        getUser()
    }, [])

    return {recipientUser}
}