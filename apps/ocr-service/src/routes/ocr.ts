import { FastifyInstance } from 'fastify';
import { extractTextFromImage } from '../services/ocr.service';
import { parseBill } from '../services/parser.service';
import { withTimeout } from '../plugins/timeout';
import { retry } from '../plugins/retry';

export default async function ocrRoutes(
  fastify: FastifyInstance
) {
  fastify.post('/scan', async (request, reply) => {
    const data = await request.file();

    if (!data) {
      return reply.status(400).send({
        message: 'Image file required',
      });
    }

    const buffer = await data.toBuffer();

    try {
      const text = await retry(()=>
        withTimeout(extractTextFromImage(buffer)
      ,8000),2
      );
      const parsed = parseBill(text);
      return reply.send({
        success:true,
        rawText: text,
        parsed,
      });

    } catch (err) {
      fastify.log.error(
        { err },
        'OCR failed'
      );
      return reply.send({
        success: false,
        message:
          'Could not scan bill. Please add expense manually.',
        parsed: {
          items: [],
          tax: null,
          discount: null,
          total: null,
          confidence: 0,
        },
      });
    }
  });
}
