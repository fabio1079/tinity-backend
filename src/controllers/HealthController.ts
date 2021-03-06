import { Request, Response } from "express";
import { getConnection } from "typeorm";

export default {
  async index(req: Request, res: Response) {
    try {
      const connection = await getConnection();
      await connection.query("select 1");

      return res.status(200).json({
        status: "alive",
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        status: "dead. see logs",
      });
    }
  },
};
