import { getRepository, Repository } from "typeorm";
import urlSafe from "url-regex-safe";

import { Link } from "../entity/Link";

export type Builted<T> = [T?, string?];

const CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

const getRandomChar = () => {
  let pos = Math.floor(Math.random() * CHARS.length);
  return CHARS[pos];
};

export default class LinkService {
  constructor(private linkRepository: Repository<Link> = getRepository(Link)) {}

  public async store(link: Link): Promise<Link> {
    return await this.linkRepository.save(link);
  }

  public async findOriginal(url: string): Promise<Link> {
    const original = LinkService.stripUrl(url);

    return await this.linkRepository.findOne({ original });
  }

  public async findShorted(shorted: string): Promise<Link> {
    return await this.linkRepository.findOne({ shorted });
  }

  public async getTop(): Promise<Link[]> {
    return await this.linkRepository.find({
      order: { accessed: "DESC" },
      take: 5,
    });
  }

  public static stripUrl(url: string): string {
    if (url.search("https://") === 0) {
      url = url.slice(8);
    } else if (url.search("http://") === 0) {
      url = url.slice(7);
    }

    if (url.search("www") !== 0) {
      url = ["www.", url].join("");
    }

    return url;
  }

  public static getProtocol(url: string): string {
    if (url.search("https://") === 0) {
      return "https";
    }

    if (url.search("http://") === 0) {
      return "http";
    }

    return "";
  }

  public static buildLink(url: string): Builted<Link> {
    if (!LinkService.urlIsValid(url)) {
      return [undefined, "Invalid URL"];
    }

    const original = LinkService.stripUrl(url);
    const protocol = LinkService.getProtocol(url);

    const link = new Link();

    link.original = original;
    link.protocol = protocol;
    link.shorted = this.generateShortedHash();

    return [link, undefined];
  }

  public static urlIsValid(url: string): boolean {
    return urlSafe({ exact: true, strict: true }).test(url);
  }

  private static generateShortedHash(): string {
    const chars = [];

    for (let i = 0; i < 6; ++i) chars.push(getRandomChar());

    return chars.join("");
  }

  public static redirectionUrl(link: Link): string {
    return [link.protocol, "://", link.original].join("");
  }
}
