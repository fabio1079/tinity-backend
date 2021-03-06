import supertest from "supertest";
import app from "../config/app";
import settupApp from "../config/settup-app";

export const request = supertest(settupApp(app));
