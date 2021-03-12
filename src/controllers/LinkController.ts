import { Request, Response } from "express";
import LinkService from "../services/LinkService";

import {
  CANT_CREATE_LINK,
  INVALID_SHORTED,
  LINK_NOT_FOUND,
} from "../error/messages";

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

    let result = LinkService.buildLink(original);

    if (result.isFailure) {
      return res.status(400).json({
        link: undefined,
        error: result.error,
      });
    }

    try {
      let link = await linkService.store(result.value);

      return res.status(201).json({
        link,
        error: undefined,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        link: undefined,
        error: CANT_CREATE_LINK,
      });
    }
  },

  async redirectToOriginal(req: Request, res: Response) {
    const { shorted } = req.params;

    if (!shorted || shorted.length !== 6) {
      return res.status(500).json({
        error: INVALID_SHORTED,
      });
    }

    const linkService = new LinkService();
    const link = await linkService.findShorted(shorted);

    if (!link) {
      return res.status(404).json({
        link: undefined,
        error: LINK_NOT_FOUND,
      });
    }

    link.accessed += 1;
    await linkService.store(link);

    return res.status(302).redirect(LinkService.redirectionUrl(link));
  },
};
