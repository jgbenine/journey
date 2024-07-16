import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../lib/prisma";
import { ClientError } from "../errors/client-error";
import { env } from "../env";
import z from "zod";

export async function confirmParticipant(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().patch("/participants/:participantId/confirm",
    {
      schema: {
        tags: ["participants"],
        summary: "Confirms a participant on a trip.",
        params: z.object({
          participantId: z.string().uuid(),
        }),
        body: z.object({
          name: z.string(),
          email: z.string().email(),
        }),
      },
    },
    async (request, reply) => {
      const { participantId } = request.params;
      const { name, email } = request.body;

      const participant = await prisma.participant.findUnique({
        where: { id: participantId },
      });

      if (!participant) {
        throw new ClientError("Participante não encontrado!");
      }

      if(participant.is_confirmed){
        return reply.redirect(`${env.FRONT_END_URL}/trips/${participant.trip_id}`)
      }

      await prisma.participant.update({
        where: { id: participantId },
        data: {
          is_confirmed: true,
          name,
        },
      })
    }
  );
}
