import { FastifyInstance } from 'fastify';
import { extractTextFromImage } from '../services/ocr.service';
import { parseBill } from '../services/parser.service';

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

    const text = await extractTextFromImage(buffer);
    const parsed = parseBill(text);

    return reply.send({
      rawText: text,
      parsed,
    });
  });
}
