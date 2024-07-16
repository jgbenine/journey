import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../lib/prisma";
import { ClientError } from "../errors/client-error";
import z from "zod";

export async function getParticipantEmail(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/trips/:tripId/participant/:participantEmail",
    {
      schema: {
        params: z.object({
          tripId: z.string().uuid(),
          participantEmail: z.string().email(),
        }),
      },
    },
    async (request) => {
      const { tripId, participantEmail } = request.params;

      const trip = await prisma.trip.findUnique({
        where: { id: tripId },
        include: {
          Participant: {
            where: { email: participantEmail },
            select: {
              id: true,
              name: true,
              email: true,
              is_confirmed: true,
            },
          },
        },
      });

      if (!trip) {
        throw new ClientError("Viagem não encontrada");
      }

      return { participants: trip.Participant };
    }
  );
}
