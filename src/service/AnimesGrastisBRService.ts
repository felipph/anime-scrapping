import axios from 'axios';
import cheerio from 'cheerio';
import {createHash} from 'crypto';
import {Anime} from '../types/types';

export class AnimesGrastisBRService {
  hash(string: any) {
    return createHash('sha256').update(string).digest('hex');
  }

  async getPage(pageNumber: string): Promise<Anime[]> {
    const url = `https://www.animesgratisbr.biz/animes/page/${pageNumber}/`;
    const listaAnimes: Anime[] = [];
    await axios(url)
      .then((response: {data: any}) => {
        const html = response.data;
        const $ = cheerio.load(html);
        const videos = $('div.video-conteudo');
        videos.each((_: any, item: any) => {
          const titulo = $(item).find('a[itemprop="URL"] > h2').text();
          const link = $(item)
            .find('a[itemprop="URL"]')
            .attr('href')
            ?.toString();
          const cover = $(item).find('img[itemprop="image"]').attr('src');
          listaAnimes.push({
            itemId: this.hash(link),
            title: titulo,
            link: link,
            cover: cover,
            // episodes: [],
          });
        });
        // console.log(listaAnimes);
      })
      .catch(console.error);
    return Promise.resolve(listaAnimes);
  }

  async getAllPages(numPages: number) {
    const pages = [];
    for (let i = 1; i <= numPages; i++) {
      pages.push(this.getPage(String(i)));
      console.log('Buscando página ' + i + 'de' + pages);
    }
    const allAnimes: Anime[] = [];
    await Promise.all(pages).then(async results => {
      for (const page of results) {
        allAnimes.push(...page);
      }
    });
    return allAnimes;
  }
}
