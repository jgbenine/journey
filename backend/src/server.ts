import fastify from "fastify";
import { prisma } from "./lib/prisma";
import { createTrip } from "./routes/create-trip";
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import { confirmTrip } from "./routes/confirm-trip";
import { confirmParticipant } from "./routes/confirm-participant";
import cors from "@fastify/cors"

const app = fastify();

//Alterar em prod.
app.register(cors, {
  origin: "*",
})


//zod
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

//routes
app.register(createTrip)
app.register(confirmTrip)
app.register(confirmParticipant)


app.listen({ port: 3333 }).then(() => {
  console.log("Server is running on port 3333");
});
