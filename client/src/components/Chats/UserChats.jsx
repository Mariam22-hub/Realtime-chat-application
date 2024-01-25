import { Stack } from "react-bootstrap";
import { useFetchRecepient } from "../../hooks/useFetchRecepient";

const UserChats = ({chat, user}) => {
    const {recipientUser} = useFetchRecepient(chat, user)
    console.log(recipientUser)

    return ( <Stack direction="horizontal" gap={3} className="user-card align-itemscenter p-2 
    justify-content-between">
        <div className="d-flex">
            <div className="me-2">
                A
            </div>
            <div className="text-content">
                <div className="name">{recipientUser?.name}</div>
                <div className="text">Text Message</div>
            </div>
        </div>
        <div className="d-flex flex-column align-items-end">
            <div className="date">12/12/2002</div>
            <div className="this-user-notification">2</div>
            <span className="user-online"></span>
        </div>
    </Stack> );
}
 
export default UserChats;