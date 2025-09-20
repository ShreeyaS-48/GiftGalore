import User from "../models/user.model.js";


const getAllUsers = async (req, res) =>{
    let { page, limit } = req.query;
    page = parseInt(page) || 1;   // default page = 1
    limit = parseInt(limit) || 5;
    const skip = (page - 1) * limit;
    const users = await User.find({ 'roles.Admin': { $exists: false } }).skip(skip).limit(limit);
    const total = await User.countDocuments({ 'roles.Admin': { $exists: false } });
    if (!users.length) {
        return res.status(204).json({ message: 'No non-admin users found' });
    }
    res.json({page,
        totalPages: 
        Math.ceil(total / limit),
        totalUsers: 
        total,
        users});
}




const getAllAdmins = async (req, res) =>{
    const users = await User.find({ 'roles.Admin': { $exists: true } });
    if (!users.length) {
        return res.status(204).json({ message: 'No non-admin users found' });
    }
    
    res.json(users);
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

const updateUserHistory = async (req, res) => {
    if (!req?.params?.name) {
      return res.status(400).json({ message: "User name parameter is required" });
    }
  
    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }
  
    try {
      const user = await User.findOne({ name: req.params.name }).exec();
      if (!user) {
        return res.status(404).json({ message: `No user matches ${req.params.name}` });
      }
  
      let recent = user.recentProducts.map((p) => p.toString());
  
      // Only add if not already present
      if (!recent.includes(productId.toString())) {
        recent.push(productId);
  
        // Keep only last 5
        if (recent.length > 5) {
          recent = recent.slice(-5);
        }
  
        // Atomic update
        await User.findOneAndUpdate(
          { name: req.params.name },
          { recentProducts: recent },
          { new: true }
        ).populate("recentProducts");
      }
  
      const updatedUser = await User.findOne({ name: req.params.name }).populate("recentProducts");
      res.status(200).json(updatedUser.recentProducts);
  
    } catch (err) {
      console.error("Error updating history:", err);
      res.status(500).json({ message: "Server error updating history" });
    }
  };
  
  

export {
    getAllUsers,
    deleteUser,
    getUser, getAllAdmins,
    updateUserHistory
}