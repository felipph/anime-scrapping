import { AnimesGrastisBRService } from './service/AnimesGrastisBRService';
import * as AWS from 'aws-sdk';
const dynamoDB = new AWS.DynamoDB.DocumentClient();
exports.lambdaHandler = async function (payload, context) {
    const pagesToFetch = Number(payload.maxPages !== undefined ? payload.maxPages : process.env['MAX_PAGES']);
    console.log(process.env);
    const service = new AnimesGrastisBRService();
    let pages = [];
    const allResult = [];
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
async function processarPaginas(pages, allResult) {
    await Promise.all(pages).then(async (results) => {
        for (const page of results) {
            allResult.push(...page);
            const putReqs = page.map((item) => ({
                PutRequest: {
                    Item: item,
                },
            }));
            const req = {
                RequestItems: {
                    AnimeList: putReqs,
                },
            };
            try {
                await dynamoDB.batchWrite(req).promise();
            }
            catch (e) {
                console.log('Deu erro ao escreve no dynamo');
            }
        }
    });
}
//# sourceMappingURL=index.js.map