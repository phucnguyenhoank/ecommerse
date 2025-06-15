import { DataSource } from "typeorm";
import dotenv from "dotenv";
import express from "express";

dotenv.config();

export const AppDataSource = new DataSource({
  type: process.env.DB_TYPE as any,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 1433,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: process.env.DB_SYNCHRONIZE === "true",
  logging: process.env.DB_LOGGING === "true",
  entities: ["src/entity/*.ts"],
  options: {
    encrypt: process.env.DB_ENCRYPT === "true",
  },
});

AppDataSource.initialize()
  .then(() => console.log("✅ Database Connected!"))
  .catch((err) => console.error("❌ Database Connection Error:", err));
