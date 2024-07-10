import type { FastifyInstance } from "fastify";

type FastifyErrorHandle = FastifyInstance['errorHandler']

export const errorHandler: FastifyErrorHandle = (error, request, reply) =>{
  console.log(error);
  return reply.status(500).send({message: 'Internet Server Error'});
}
