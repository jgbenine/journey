import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../lib/prisma";
import { dayjs } from "../lib/dayjs";
import z from "zod";

export async function createActivity(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post("/trips/:tripId/activities",
    {
      schema: {
        params: z.object({
          tripId: z.string().uuid(),
        }),
        body: z.object({
          title: z.string().min(4),
          occours_at: z.coerce.date()
        }),
      },
    },
    async (request) => {
      const { tripId } = request.params;
      const { title, occours_at } = request.body;

      const trip = await prisma.trip.findUnique({
        where: { id: tripId },
      })

      if(!trip){
        throw new Error("Viagem não encontrada")
      }

      if(dayjs(occours_at).isBefore(trip.starts_at)){
        throw new Error("Data da atividade inválida")
      }

      if(dayjs(occours_at).isAfter(trip.ends_at)){
        throw new Error("Data da atividade inválida")
      }


      const activity = await prisma.activity.create({
        data: {
          title,
          occours_at,
          trip_id: tripId,
        },
      })

      return {activityId: activity.id}
    },
  );
}
