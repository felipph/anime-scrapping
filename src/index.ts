import {AnimesGrastisBRService} from './service/AnimesGrastisBRService';
import {Anime, LambdaPayload} from './types/types';
import * as AWS from 'aws-sdk';

const dynamoDB = new AWS.DynamoDB.DocumentClient();

exports.lambdaHandler = async function (payload: LambdaPayload, context: any) {
  const pagesToFetch = Number(
    payload.maxPages !== undefined ? payload.maxPages : process.env['MAX_PAGES']
  );
  console.log(process.env);

  const service = new AnimesGrastisBRService();

  let pages = [];
  const allResult: string | any[] = [];
  for (let i = 1; i <= pagesToFetch; i++) {
    pages.push(service.getPage(String(i)));
    if (pages.length >= 10) {
      await processarPaginas(pages, allResult);
      pages = [];
    }
  }
  if (pages.length > 0) {
    await processarPaginas(pages, allResult);
  }
  return {
    size: allResult.length,
    params: payload,
  };
};
async function processarPaginas(pages: Promise<Anime[]>[], allResult: any[]) {
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
      await dynamoDB.batchWrite(req).promise();
    }
  });
}

