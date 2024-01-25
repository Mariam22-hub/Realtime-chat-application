const MessageModel = require('../Models/messageModel');

// create message
exports.createMessage = async (req, res)=>{
    const {chatId, senderId, text} = req.body;
    const message = new MessageModel({chatId, senderId, text})

    try{
        await message.save()
        res.status(201).json(message)
    }
    catch(error){
        console.log(error)
        res.status(500).json(error)
    }
}

// getMessages
exports.getMessages = async(req,res) => {
    const {chatId} = req.params;
    try{
        const messages = await MessageModel.find({chatId})
        res.status(200).json(messages)
    }
    catch(error){
        console.log(error)
        res.status(500).json(error)
    }
}