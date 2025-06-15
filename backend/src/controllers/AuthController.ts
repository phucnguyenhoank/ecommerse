import { Request, Response } from "express";
import { AuthService } from "../services/AuthService";
import bcrypt from "bcrypt";

interface RegisterRequestBody {
  username: string;
  password: string;
  phone: string;
  email: string;
}

interface LoginRequestBody {
  username: string;
  password: string;
}


export const register = async (
  req: Request<{}, {}, RegisterRequestBody>,
  res: Response
): Promise<void> => {
  const { username, password, phone, email } = req.body;

  const user = await AuthService.register(username, password, email, phone);

  res.status(201).json({
    status: "success",
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      phone: user.phone,
    },
  });
};

export const login = async (
  req: Request<{}, {}, LoginRequestBody>,
  res: Response
): Promise<void> => {
  const { username, password } = req.body;

  try {
    const user = await AuthService.login(username, password);

    res.status(200).json({
      status: "success",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (error: any) {
    res.status(401).json({
      status: "error",
      message: error.message || "Đăng nhập thất bại",
    });
  }
};
