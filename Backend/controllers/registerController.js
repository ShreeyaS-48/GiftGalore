import User from "../models/user.model.js";
import bcrypt from "bcrypt";

const handleNewUser = async (req, res) => {
  const { name, email, phone, address, password } = req.body;
  if (!name || !email || !phone || !address || !password)
    return res.status(400).json({ message: "Enter all required fields" });
  const duplicate = await User.findOne({ name }).exec();

  if (duplicate) return res.sendStatus(409); // conflict

  try {
    //encrypt the password
    const hashedPwd = await bcrypt.hash(password, 10);
    //create store the new user
    const result = await User.create({
      name,
      password: hashedPwd,
      email,
      address,
      phone,
    });
    res.status(201).json({ success: `New user ${name} created!` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export default handleNewUser;
