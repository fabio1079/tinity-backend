import { Request, Response } from "express";
import LinkService from "../services/LinkService";

export default {
  async top(req: Request, res: Response) {
    const linkService = new LinkService();

    let links = await linkService.getTop();

    res.status(200).json({
      links: links,
    });
  },

  async shortUrl(req: Request, res: Response) {
    const linkService = new LinkService();
    const { original } = req.body;

    const storedLink = await linkService.firstOriginal(original);

    if (storedLink) {
      return res.status(200).json({
        link: storedLink,
        error: undefined,
      });
    }

    let [link, error] = LinkService.buildLink(original);

    if (error) {
      return res.status(400).json({
        link: undefined,
        error,
      });
    }

    try {
      link = await linkService.store(link);

      return res.status(201).json({
        link,
        error: undefined,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        link: undefined,
        error: "Could not create link",
      });
    }
  },
};
