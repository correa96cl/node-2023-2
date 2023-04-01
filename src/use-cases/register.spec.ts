import { compare } from 'bcryptjs'
import { describe, expect, it } from 'vitest'
import { RegisterUseCase } from './register'
import { InMemoryUsersRepository } from 'src/repositories/in-repository/in-memory-users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists'


describe('Register Use Case', () => {

    it('should be able to register', async () => {
        const usersRepository = new InMemoryUsersRepository()
        const registerUseCase = new RegisterUseCase(usersRepository)

        const { user } = await registerUseCase.execute({
            name: 'John Doe',
            email: 'm@m.cl',
            password: '123456',
        })

        expect(user.id).toEqual(expect.any(String))
    })

    it('should hash user password upon registration', async () => {
        const usersRepository = new InMemoryUsersRepository()
        const registerUseCase = new RegisterUseCase(usersRepository)

        const { user } = await registerUseCase.execute({
            name: 'John Doe',
            email: 'm@m.cl',
            password: '123456',
        })

        const isPasswordCorrectHashed = await compare('123456', user.password_hash,)

        expect(isPasswordCorrectHashed).toBe(true)
    })


    it('should not be able to register with same email twice', async () => {
        const usersRepository = new InMemoryUsersRepository()
        const registerUseCase = new RegisterUseCase(usersRepository)

        const email = "m@m.cl"

        await registerUseCase.execute({
            name: 'John Doe',
            email,
            password: '123456',
        })


        await expect(() => registerUseCase.execute({
            name: 'John Doe',
            email,
            password: '123456',
        }),).rejects.toBeInstanceOf(UserAlreadyExistsError)
    })
})