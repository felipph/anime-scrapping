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

  const pages = [];
  for (let i = 1; i <= pagesToFetch; i++) {
    pages.push(this.getPage(String(i)));
  }
  const allResult = [];
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
      await dynamoDB.batchWrite(req).promise();
    }
  });

  return {
    size: allResult.length,
    params: payload,
  };
};
