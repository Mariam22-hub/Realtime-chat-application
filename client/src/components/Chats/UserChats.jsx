import { Stack } from "react-bootstrap";
import { useFetchRecepient } from "../../hooks/useFetchRecepient";
import undraw_profile_pic_re_iwgo from "../../assets/undraw_profile_pic_re_iwgo.svg"
import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";

const UserChats = ({chat, user}) => {
    const {recipientUser} = useFetchRecepient(chat, user)
    const {onlineUsers} = useContext(ChatContext)
    console.log(recipientUser)

    const isOnline = onlineUsers?.some((user) => user?.userId === recipientUser?._id)

    return ( 
    <Stack direction="horizontal" gap={3} 
    className="user-card align-itemscenter p-2 justify-content-between" role = "button">
        <div className="d-flex">
            <div className="me-2">
                <img src={undraw_profile_pic_re_iwgo} height ="35px" ></img>
            </div>
            <div className="text-content">
                <div className="name">{recipientUser?.name}</div>
                <div className="text">Text Message</div>
            </div>
        </div>

        <div className="d-flex flex-column align-items-end">
            <div className="date">12/12/2002</div>
            <div className="this-user-notification">2</div>
            <span className={isOnline? "user-online" : ""}></span>
        </div>
    </Stack> );
}
 
export default UserChats;