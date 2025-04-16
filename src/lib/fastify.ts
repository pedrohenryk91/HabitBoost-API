import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { SwaggerDocumentationOptions } from "docs/swagger";
import fastify from "fastify";
import cors from "@fastify/cors"
import { profileRoutes } from "http/routes/ProfileRoutes";
import { userRouter } from "http/routes/UserRoutes";
import fastifyJwt from "@fastify/jwt";
import { JWT_SECRET } from "./env";
import { HabitRoutes } from "http/routes/HabitRoutes";
import { GoalRoutes } from "http/routes/GoalRoutes";
import { ZodError } from "zod";
import { authRoutes } from "http/routes/AuthRoutes";
import { OverviewRoutes } from "http/routes/OverviewRoutes";

export const app = fastify();

app.register(fastifyJwt, {secret:JWT_SECRET})

app.register(authRoutes, {prefix:"/auth"})
app.register(userRouter, {prefix:"/user"})
app.register(profileRoutes, {prefix:"/profile"})
app.register(HabitRoutes, {prefix:"/habit"})
app.register(GoalRoutes, {prefix:"/goal"})
app.register(OverviewRoutes, {prefix:"/overview"})

app.register(cors, {
    origin: true,
    methods: ["GET","POST","PUT","PATCH","DELETE"],
    allowedHeaders: ["Content-Type","Authorization"],
    credentials: true,
})

app.register(fastifySwagger, SwaggerDocumentationOptions)

app.register(fastifySwaggerUi, {routePrefix:"/docs"})

app.setErrorHandler((error, request, reply) => {
    reply.status(error.statusCode || 500).send({
        error: error.message
    })
})