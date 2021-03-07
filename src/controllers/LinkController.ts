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

    const storedLink = await linkService.findOriginal(original);

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

  async redirectToOriginal(req: Request, res: Response) {
    const { shorted } = req.params;

    if (!shorted || shorted.length !== 6) {
      return res.status(500).json({
        error: "Invalid shorted link",
      });
    }

    const linkService = new LinkService();
    const link = await linkService.findShorted(shorted);

    if (!link) {
      return res.status(404).json({
        link: undefined,
        error: "Link not found",
      });
    }

    link.accessed += 1;
    await linkService.store(link);

    return res.status(302).redirect(LinkService.redirectionUrl(link));
  },
};
