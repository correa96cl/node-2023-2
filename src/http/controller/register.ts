
import { hash } from "bcryptjs"
import { FastifyReply, FastifyRequest } from "fastify"
import { prisma } from "src/lib/prisma"
import { PrismaUserRepository } from "src/repositories/prisma/prisma-users-repository"
import { UserAlreadyExistsError } from "src/use-cases/errors/user-already-exists"
import { RegisterUseCase } from "src/use-cases/register"
import { z } from "zod"

export async function register(request: FastifyRequest, reply: FastifyReply) {
    const registerBodySchema = z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string().min(6),
    })

    const { name, email, password } = registerBodySchema.parse(request.body)


    try {

        const usersRepository = new PrismaUserRepository()
        const registerUseCase = new RegisterUseCase(usersRepository)
        await registerUseCase.execute({
            name,
            email,
            password,
        })
    } catch (err) {

        if (err instanceof UserAlreadyExistsError) {
            return reply.status(409).send({
                message: err.message
            })
        }

        throw err

    }

    return reply.status(201).send()

}