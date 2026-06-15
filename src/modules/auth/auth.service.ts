import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../../config";
import { pool } from "../../config/db";

const signupUser = async (
  name: string,
  email: string,
  password: string,
  phone: number,
  role: string,
) => {
  const hashedPass = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `INSERT INTO users(name, email, password, phone, role) VALUES($1, $2, $3, $4, $5) RETURNING *`,
    [name, email, hashedPass, phone, role],
  );

  const { password: _, ...userWithoutPassword } = result.rows[0];
  return userWithoutPassword;
};

const signinUser = async (email: string, password: string) => {
  const result = await pool.query(`SELECT * FROM users WHERE email=$1`, [
    email,
  ]);

  if (result.rows.length === 0) {
    return null;
  }
  const user = result.rows[0];

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    return false;
  }

  const secret = config.jwt_secret;

  const token = jwt.sign(
    { name: user.name, email: user.email, role: user.role },
    secret as string,
    {
      expiresIn: "7d",
    },
  );

  // console.log(token);
  // return { token, user };
  return { token };
};

export const authService = {
  signupUser,
  signinUser,
};
