import User from "../models/user.model.js";


const getAllUsers = async (req, res) =>{
    const users = await User.find()
    if(!users) return res.status(204).json({'message': 'No users found'}) // no content
    res.json(users)
}


const deleteUser = async (req, res)=>{
    if(!req?.body?.id){
        return res.status(400).json({ "message": 'ID parameter is required' });
    }
    const user =  await User.findOne({ _id : req.body.id}).exec();
    if (!user) {
        return res.status(204).json({ "message": `No user matches ${req.body.id}` });
    }
    const result = await User.deleteOne({_id: req.body.id})
    res.json(result);
}

const getUser = async (req, res)=>{
    if(!req?.params?.name){
        return res.status(400).json({ "message": 'ID parameter is required' });
    }
    const user = await User.findOne({ name : req.params.name}).exec()
    if (!user) {
        return res.status(204).json({ "message": `No user matches ${req.param.name}` });
    }
    res.json(user);
}

export {
    getAllUsers,
    deleteUser,
    getUser
}