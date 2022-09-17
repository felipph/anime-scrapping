import {AnimesGrastisBRService} from './service/AnimesGrastisBRService';
import {LambdaPayload} from './types/types';

exports.lambdaHandler = async function (payload: LambdaPayload, context: any) {
  const pagesToFetch = Number(
    payload.maxPages !== undefined ? payload.maxPages : process.env['MAX_PAGES']
  );

  const service = new AnimesGrastisBRService();
  const pages = service.getAllPages(pagesToFetch);
  console.log(await pages);
  console.log((await pages).length);
  return {
    pages: await pages,
    size: (await pages).length,
    params: payload,
  };
};
