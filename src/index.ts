import {AnimesGrastisBRService} from './service/AnimesGrastisBRService';
import {Anime, LambdaPayload} from './types/types';
import * as AWS from 'aws-sdk';

const dynamoDB = new AWS.DynamoDB.DocumentClient();

exports.lambdaHandler = async function (payload: LambdaPayload, context: any) {
  const concurrentItens = 5;

  const pagesToFetch = Number(
    payload.maxPages !== undefined ? payload.maxPages : process.env['MAX_PAGES']
  );
  console.log(process.env);

  const service = new AnimesGrastisBRService();

  const loops = Math.round(pagesToFetch / concurrentItens) + 1;
  const allResult = [];
  let totalPagesFetched = 1;
  for (let j = 0; j < loops; j++) {
    const pages = [];
    for (let i = 1; i <= 5; i++) {
      if (totalPagesFetched > pagesToFetch) {
        break;
      }
      pages.push(service.getPage(String(i)));
      totalPagesFetched++;
    }
    if (pages.length > 0) {
      await Promise.all(pages).then(async results => {
        for (const page of results) {
          allResult.push(...page);
          const putReqs = page.map((item: any) => ({
            PutRequest: {
              Item: item,
            },
          }));
          const req = {
            RequestItems: {
              AnimeList: putReqs,
            },
          };
          console.log('RequestItems');
          console.log(req);
          console.log(req.RequestItems.AnimeList.length);
          await dynamoDB.batchWrite(req, (err, data) => {
            if (err) {
              console.log(err);
              throw err;
            } else {
              console.log('Página OK');
              console.log(data);
            }
          });
        }
      });
    }
  }

  return {
    size: allResult.length,
    params: payload,
    totalPagesFetched: totalPagesFetched,
  };
};
