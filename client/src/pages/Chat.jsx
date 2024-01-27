import { useContext } from "react";
import { ChatContext } from "../context/ChatContext";
import { Container, Stack } from "react-bootstrap";
import UserChats from "../components/Chats/userChats";
import { AuthContext } from "../context/AuthContext";
import PotentialChats from "../components/Chats/PotentialChats";
import ChatBox from "../components/Chats/ChatBox";

const Chat = () => {
    const {user} = useContext(AuthContext)
    const {userChats,
        isUserChatsLoading,
        userChatsError, updateCurrentChat} = useContext(ChatContext)

    console.log("user chats", userChats)
    return ( 
        <Container>
            <PotentialChats/>
            {userChats?.length < 1 ? null : (<Stack direction="horizontal" gap={4} className="align-items-start">
                    <Stack className="message-box flex-grow-0 pe-3" gap={3}>
                        {isUserChatsLoading && <p>Loading chats...</p>}
                        {userChats?.map((chat, index) => {
                            return (
                                <div key={index} onClick={()=> updateCurrentChat(chat)}> 
                                    <UserChats chat={chat} user={user}/> 
                                </div>
                            )
                        })}
                    </Stack>
                    <ChatBox/>
                </Stack>    
            )}
        </Container> 
    );
}
 
export default Chat;