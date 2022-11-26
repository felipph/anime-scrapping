import axios from 'axios';
import cheerio from 'cheerio';
import { createHash } from 'crypto';
export class AnimesGrastisBRService {
    hash(string) {
        return createHash('sha256').update(string).digest('hex');
    }
    async getPage(page) {
        const url = `https://www.animesgratisbr.biz/animes/page/${page}/`;
        const listaAnimes = [];
        await axios(url)
            .then((response) => {
            const html = response.data;
            const $ = cheerio.load(html);
            const videos = $('div.video-conteudo');
            videos.each((_, item) => {
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
    async getAllPages(numPages) {
        const pages = [];
        for (let i = 1; i <= numPages; i++) {
            pages.push(this.getPage(String(i)));
        }
        const allAnimes = [];
        await Promise.all(pages).then(async (results) => {
            for (const page of results) {
                allAnimes.push(...page);
            }
        });
        return allAnimes;
    }
}
//# sourceMappingURL=AnimesGrastisBRService.js.map