import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../lib/prisma";
import z from "zod";

export async function getParticipants(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get("/trips/:tripId/participants",
    {
      schema: {
        params: z.object({
          tripId: z.string().uuid(),
        }),
      },
    },
    async (request) => {
      const { tripId } = request.params;

      const trip = await prisma.trip.findUnique({
        where: { id: tripId },
        include: {
          Participant:{
            select:{
              id: true,
              name: true,
              email: true,
              is_confirmed: true,
            }
          }
        },
      });

      if (!trip) {
        throw new Error("Viagem não encontrada");
      }

      return { participants: trip.Participant };
    }
  );
}
