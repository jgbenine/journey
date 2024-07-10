import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../lib/prisma";
import { dayjs } from "../lib/dayjs";
import { getMailClient } from "../lib/mail";
import { ClientError } from "../errors/client-error";
import { env } from "../env";
import nodemailer from "nodemailer";
import z from "zod";

export async function createInvite(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/trips/:tripId/invites",
    {
      schema: {
        params: z.object({
          tripId: z.string().uuid(),
        }),
        body: z.object({
          email: z.string().email(),
        }),
      },
    },
    async (request) => {
      const { tripId } = request.params;
      const { email } = request.body;

      const trip = await prisma.trip.findUnique({
        where: { id: tripId },
      });

      if (!trip) {
        throw new ClientError("Viagem não encontrada");
      }

      const participant = await prisma.participant.create({
        data: {
          email,
          trip_id: tripId,
        },
      });

      const formartStartDate = dayjs(trip?.starts_at).format("LL");
      const formartEndDate = dayjs(trip?.ends_at).format("LL");

      const mail = await getMailClient();

      const confirmationLink = `${env.API_BASE_URL}/participants/${participant.id}/confirm`;
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

      return { participantId: participant.id };
    }
  );
}
