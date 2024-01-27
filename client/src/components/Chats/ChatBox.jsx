import { createContext, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import { useFetchRecepient } from "../../hooks/useFetchRecepient";
import { Stack } from "react-bootstrap";
import moment from "moment"

const ChatBox = () => {
    const {user} = useContext(AuthContext)
    const {messages, isMessagesLoading, currentChat} = useContext(ChatContext)
    const {recipientUser} = useFetchRecepient(currentChat, user)

    if (!recipientUser) 
    return (
        <p style={{textAlign:"center", width: "100%"}}>
            No conversation selected yet
        </p>
    )
    if (isMessagesLoading) 
    return (
        <p style={{textAlign:"center", width: "100%"}}>
            Loading Chat...
        </p>
    )

    return ( 
        <Stack gap={4} className="chat-box">
            <div className="chat-header">
                <strong>{recipientUser?.name}</strong>
            </div>
            <Stack gap={3} className="messages">
                {messages && messages.map((message, index) => 
                    
                    <Stack key={index} className={`${message?.senderId === 
                        user?._id ? "message self align-self-end flex-grow-0" 
                        : "message align-self-start flex-grow-0"}`}>

                        <span>{message.text}</span>
                        <span className="message-footer">{moment(message.createdAt).calendar}</span>
                    
                    </Stack>
                )}
            </Stack>
        </Stack> 
    );
}
 
export default ChatBox;