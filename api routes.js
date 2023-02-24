import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { User } from "./models/User";

app.post("/api/users", async (req: Request, res: Response) => {
  const userRepository = getRepository(User);
  const { username, password, email } = req.body;

  const existingUser = await userRepository.findOne({ username });
  if (existingUser) {
    return res.status(400).send({ message: "Username already exists" });
  }

  const user = new User();
  user.username = username;
  user.password = password;
  user.email = email;

  try {
    await userRepository.save(user);
    return res.send({ user });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Failed to create user" });
  }
});
