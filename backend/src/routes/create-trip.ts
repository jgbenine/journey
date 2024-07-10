import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../lib/prisma";
import { getMailClient } from "../lib/mail";
import { dayjs } from "../lib/dayjs";
import nodemailer from "nodemailer";
import { ClientError } from "../errors/client-error";
import z from "zod";

export async function createTrip(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/trips",
    {
      schema: {
        body: z.object({
          destination: z.string().min(4),
          starts_at: z.coerce.date(),
          ends_at: z.coerce.date(),
          owner_name: z.string(),
          owner_email: z.string().email(),
          emails_to_envite: z.array(z.string().email()),
        }),
      },
    },
    async (request) => {
      const {
        destination,
        ends_at,
        starts_at,
        owner_email,
        owner_name,
        emails_to_envite,
      } = request.body;

      if (dayjs(starts_at).isBefore(new Date())) {
        throw new ClientError("Data inicial inválida");
      }

      if (dayjs(ends_at).isBefore(starts_at)) {
        throw new ClientError("Data final inválida");
      }

      const trip = await prisma.trip.create({
        data: {
          destination,
          starts_at,
          ends_at,
          Participant: {
            createMany: {
              data: [
                {
                  name: owner_name,
                  email: owner_email,
                  is_confirmed: true,
                  is_owner: true,
                },
                ...emails_to_envite.map((email) => {
                  return { email };
                }),
              ],
            },
          },
        },
      });

      const formartStartDate = dayjs(starts_at).format("LL");
      const formartEndDate = dayjs(ends_at).format("LL");

      const confirmationLink = `http://localhost:3333/trips/${trip.id}/confirm`;

      //Teste de envio de email nodemailer
      const mail = await getMailClient();

      const message = await mail.sendMail({
        from: {
          name: "Equipe Planner",
          address: "planner@example.com",
        },
        to: {
          name: owner_name,
          address: owner_email,
        },
        subject: `Confirme sua viagem para ${destination} em ${formartStartDate}`,
        html: `
          <div style="font-family: sans-serif; font-size: 16px; line-height: 1.6;">
            <p>Você solicitou a criação de uma viagem para <strong> ${destination} </strong> nas datas de ${formartStartDate} até ${formartEndDate}.</p>
            <p></p>
            <p>Para confirmar sua viagem, clique no link abaixo:</p>
            <p></p>
            <p>
              <a href="${confirmationLink.toString()}">Confirmar viagem</a>
            </p>
            <p>Caso você não saiba do que se trata esse e-mail, apenas ignore esse e-mail.</p>
          </div>
        `.trim(),
      });

      console.log(nodemailer.getTestMessageUrl(message));

      return {
        tripId: trip.id,
      };
    }
  );
}
