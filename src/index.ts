import {AnimesGrastisBRService} from './service/AnimesGrastisBRService';
import {Anime, LambdaPayload} from './types/types';
import * as AWS from 'aws-sdk';

// URI and other properties could be load by ENV Vars or by property file (.env)
if (process.env['LOCALSTACK_HOSTNAME']) {
  AWS.config.update({
    region: 'us-east-1',
    endpoint: 'http://localhost:4566'
  });
}
const dynamoDB = new AWS.DynamoDB.DocumentClient();

exports.lambdaHandler = async function (payload: LambdaPayload, context: any) {
  const pagesToFetch = Number(
    payload.maxPages !== undefined ? payload.maxPages : process.env['MAX_PAGES']
  );
  console.log(process.env);

  const service = new AnimesGrastisBRService();

  let pages = [];
  const allResult: unknown[] = [];
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
async function processarPaginas(
  pages: Promise<Anime[]>[],
  allResult: unknown[]
) {
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
      dynamoDB.batchWrite(req, (err, data) => {
        if (err) {
          console.log('Erro ao escrever no DynamoDB!');
          console.log(err);
        }
      });
    }
  });
}
