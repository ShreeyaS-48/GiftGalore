import User from "../models/user.model.js";

const handleLogout = async (req, res) => {
  //on client also delete access token
  const cookies = req.cookies;
  // optional chaining if cookies check for jwt property
  if (!cookies?.jwt) return res.sendStatus(204); // successful no content to send back
  const refreshToken = cookies.jwt;
  //is refreshToken in DB
  const foundUser = await User.findOne({ refreshToken }).exec();
  if (!foundUser) {
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true }); //secure : true;
    return res.sendStatus(204);
  }
  // refresh token found in db - delete it
  foundUser.refreshToken = "";
  const result = await foundUser.save();
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true }); //secure true - https secure: true
  return res.sendStatus(204);
};

export default handleLogout;
