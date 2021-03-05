import { Request, Response } from "express";
import LinkService from "../services/LinkService";

export default {
  async index(req: Request, res: Response) {
    const linkService = new LinkService();

    let links = await linkService.getTop();

    res.status(200).json({
      links: links
    });
  },
};
