import { getRepository, Repository } from "typeorm";
import { Link } from "../entity/Link";

export default class LinkService {
  constructor(private linkRepository: Repository<Link> = getRepository(Link)) {}

  public stripUrl(url: string): string {
    if (url.search("https://") === 0) {
      return url.slice(8);
    }

    if (url.search("http://") === 0) {
      return url.slice(7);
    }

    return url;
  }

  public getProtocol(url: string): string {
    if (url.search("https://") === 0) {
      return "https";
    }

    if (url.search("http://") === 0) {
      return "http";
    }

    return "";
  }

  public async firstOriginal(url: string): Promise<Link> {
    const original = this.stripUrl(url);

    return await this.linkRepository.findOne({ original });
  }

  public async getTop(): Promise<Link[]> {
    return await this.linkRepository.find({
      order: { accessed: "DESC" },
      take: 5,
    });
  }
}
