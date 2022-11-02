import { HttpService } from '@nestjs/axios';

/* eslint-disable max-len */
export class DeepLinkUtil {
  private static urlFirebase =
    'https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=APIKEY';
  private static apn = 'com.tribune.app';
  private static baseLink = 'https://example.page.link';
  private static webLink = 'https://www.example.page.link';

  static async buildDeepLink(
    path: string,
    title = '',
    description = '',
    params = '',
  ): Promise<string> {
    const httpService = new HttpService();
    description = description.length > 0 ? `"${description}"` : description;
    const longLink = `${this.baseLink}/?link=${
      this.webLink
    }/${path}?${params}&apn=${this.apn}&efr=1&st=${encodeURIComponent(
      title,
    )}&sd=${encodeURIComponent(description)}`;
    const result = await httpService
      .post(this.urlFirebase, {
        longDynamicLink: longLink,
        suffix: {
          option: 'UNGUESSABLE',
        },
      })
      .toPromise();
    if (result.status === 200) {
      const { shortLink } = result.data;
      return shortLink;
    }
    return longLink;
  }
}
