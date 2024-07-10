import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../lib/prisma";
import { dayjs } from "../lib/dayjs";
import { getMailClient } from "../lib/mail";
import { ClientError } from "../errors/client-error";
import nodemailer from "nodemailer";
import z from "zod";

export async function confirmTrip(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/trips/:tripId/confirm",
    {
      schema: {
        params: z.object({
          tripId: z.string().uuid(),
        }),
      },
    },
    async (request, reply) => {
      const { tripId } = request.params;

      const trip = await prisma.trip.findUnique({
        where: {
          id: tripId,
        },
        include: {
          Participant: {
            where: {
              is_owner: false,
            },
          },
        },
      });

      if (!tripId) {
        throw new ClientError("Trip não encontrado");
      }

      if (trip?.is_confirmed) {
        return reply.redirect(`https://localhost:3000/trips/${tripId}`);
      }

      await prisma.trip.update({
        where: { id: tripId },
        data: { is_confirmed: true },
      });

      const formartStartDate = dayjs(trip?.starts_at).format("LL");
      const formartEndDate = dayjs(trip?.ends_at).format("LL");

      const mail = await getMailClient();

      await Promise.all(
        trip.Participant.map(async (participant) => {
          const confirmationLink = `http://localhost:3333/participants/${participant.id}/confirm`;
          const message = await mail.sendMail({
            from: {
              name: "Equipe Planner",
              address: "planner@example.com",
            },
            to: participant.email,
            subject: `Confirme sua presença para ${trip?.destination} em ${formartStartDate}`,
            html: `
          <div style="font-family: sans-serif; font-size: 16px; line-height: 1.6;">
            <p>Você foi convidado para uma viagem a <strong> ${
              trip?.destination
            } </strong> nas datas de ${formartStartDate} até ${formartEndDate}.</p>
            <p>Para confirmar sua presença, clique no link abaixo:</p>
            <p>
              <a href="${confirmationLink.toString()}">Confirmar presença</a>
            </p>
            <p>Caso você não saiba do que se trata esse e-mail, apenas ignore esse e-mail.</p>
          </div>
        `.trim(),
          });

          console.log(nodemailer.getTestMessageUrl(message));
        })
      );

      return reply.redirect(`https://localhost:3000/trips/${tripId}`);
    }
  );
}
