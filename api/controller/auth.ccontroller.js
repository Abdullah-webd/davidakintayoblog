import User from "../model/user.model.js";
import bcrypt from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config();
export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  if (
    !username ||
    !email ||
    !password ||
    username === "" ||
    email === "" ||
    password === ""
  ) {
    next(errorHandler(400, "All fields are required"));
  }

  const hashedpassword = await bcrypt.hashSync(password, 10);

  const user = new User({
    username,
    email,
    password: hashedpassword,
  });

  try {
    await user.save();
    res.status(200).json({ message: "User created successfully" });
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password || email === "" || password === "") {
    next(errorHandler(400, "All fields are required"));
  }

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(404, "User not found"));
    }
    const validPassword = await bcrypt.compare(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(400, "Invalid Password"));
    }
    const token = jwt.sign({ id: validUser._id,isAdmin:validUser.isAdmin }, process.env.JWT_SECRET);

    const { password: pass, ...rest } = validUser._doc;

    res
      .status(200)
      .cookie("access_token", token, { httpOnly: true,maxAge: 100 * 365 * 24 * 60 * 60 * 1000 })
      .json({ ...rest, id: validUser._id });
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  const { email, name, googlePhotoUrl } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      if (googlePhotoUrl && user.profilePicture !== googlePhotoUrl) {
        user.profilePicture = googlePhotoUrl;
        await user.save(); // save updated profile
      }
      const token = jwt.sign({ id: user._id,isAdmin:user.isAdmin }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = user._doc;
      return res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .json(rest);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedpassword = await bcrypt.hashSync(generatedPassword, 10);
      const newUser = new User({
        username:
          name.toLowerCase().split(" ").join("") +
          Math.random().toString(9).slice(-4),
        email,
        password: hashedpassword,
        profilePicture: googlePhotoUrl,
      });
      await newUser.save();

      const token = jwt.sign({ id: newUser._id,isAdmin:newUser.isAdmin }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = newUser._doc;
      return res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};
