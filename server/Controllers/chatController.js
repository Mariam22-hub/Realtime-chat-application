const ChatModel = require('../Models/chatModel');

// create chat
exports.createChat = async (req, res) =>{
    const {firstId, secondId} = req.body

    try {
        const chat = await ChatModel.findOne({
            members: {$all: [firstId, secondId]}
        })
        if (chat){
            return res.status(200).json(chat)
        }
        const newChat = new ChatModel({
            members: [firstId, secondId]
        })

        await newChat.save()
        res.status(201).json({
            firstId,
            secondId
        }) 
    }
    catch(error){
        console.log(error)
        res.status(500).json(error)
    }
}

// find user chat
exports.findUserChats = async (req,res)=>{
    const {userId} = req.params.userId
    
    try{
        const chats = await ChatModel.find({
            members: {$in: [userId]}
        })
        res.status(200).json({
            chats
        }) 
    }
    catch(e){
        console.log(e)
        res.status(500).json(e)
    }
}

// find one chat
exports.findChat = async (req,res)=>{
    const {firstId, secondId} = req.params
    
    try{
        const chat = await ChatModel.findOne({
            members: {$all: [firstId, secondId]}
        })
        res.status(200).json({
            chat
        }) 
    }
    catch(e){
        console.log(e)
        res.status(500).json(e)
    }
}

