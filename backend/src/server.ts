import fastify from "fastify";
import { prisma } from "./lib/prisma";
import { createTrip } from "./routes/create-trip";
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import { confirmTrip } from "./routes/confirm-trip";
import { confirmParticipant } from "./routes/confirm-participant";
import { createActivity } from "./routes/create-activity";
import { getActivities } from "./routes/get-activity";
import { createLink } from "./routes/create-link";
import { getLinks } from "./routes/get-links";
import { getParticipants } from "./routes/get-participants";
import { createInvite } from "./routes/create-invite";
import { updateTrip } from "./routes/update-trip";
import cors from "@fastify/cors"
import { getTripDetails } from "./routes/get-trip-details";
import { getParticipantDetails } from "./routes/get-participant-details";
import { errorHandler } from "./error-handler";
import { env } from "./env";

const app = fastify();

//Registrando cors, alterar para rotas do front-end em prod.
app.register(cors, {
  origin: "*",
})

//Zod
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

//Substituindo erro trativa de erros padrão do fastify
app.setErrorHandler(errorHandler);

//Registrando rotas
app.register(createTrip)
app.register(confirmTrip)
app.register(confirmParticipant)
app.register(createActivity)
app.register(getActivities)
app.register(createLink)
app.register(getLinks)
app.register(getParticipants)
app.register(createInvite)
app.register(updateTrip)
app.register(getTripDetails)
app.register(getParticipantDetails)


app.listen({ port: 3333, host: "0.0.0.0" }).then(() => {
  console.log("Server is running on port 3333");
});
