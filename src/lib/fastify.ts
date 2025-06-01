import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { SwaggerDocumentationOptions } from "docs/swagger";
import fastify from "fastify";
import cors from "@fastify/cors"
import { profileRoutes } from "http/routes/ProfileRoutes";
import { userRouter } from "http/routes/UserRoutes";
import fastifyJwt from "@fastify/jwt";
import { COOKIE_SECRET, JWT_SECRET } from "./env";
import { HabitRoutes } from "http/routes/HabitRoutes";
import { GoalRoutes } from "http/routes/GoalRoutes";
import { authRoutes } from "http/routes/AuthRoutes";
import { UpdateRoutes } from "http/routes/UpdateRoutes";
import { UploadRoutes } from "http/routes/UploadRoutes";
import fastifyMultipart from "@fastify/multipart";
import { CategoryRoutes } from "http/routes/CategoryRoutes";
import { RankRoutes } from "http/routes/RankRoutes";
import fastifyCookie from "@fastify/cookie";

export const app = fastify();

app.register(fastifyJwt, {secret:JWT_SECRET})

app.register(fastifyMultipart, {
    attachFieldsToBody: false,
    limits: {
        fileSize: 10 * 1024 * 1024 //10 mb
    },
})

app.register(fastifyCookie, {
    secret:COOKIE_SECRET,
    parseOptions:{}
})

app.register(authRoutes, {prefix:"/auth"})
app.register(userRouter, {prefix:"/user"})
app.register(profileRoutes, {prefix:"/profile"})
app.register(HabitRoutes, {prefix:"/habit"})
app.register(GoalRoutes, {prefix:"/goal"})
app.register(RankRoutes, {prefix:"/ranking"})
app.register(UpdateRoutes, {prefix:"/update"})
app.register(UploadRoutes, {prefix:"/upload"})
app.register(CategoryRoutes, {prefix:"/category"})

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