import { PrismaClient, Prisma } from "@prisma/client"
import { DefaultArgs } from "@prisma/client/runtime/library"
import { UsernamePasswordInput } from "../src/resolvers/UsernamePasswordInput"

export const validateRegister = async (options: UsernamePasswordInput, p: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>) => {
    if (options.username.length <= 2) {
        return [{
            field: "username",
            message: "length must be greater than 2",
        }]

    }
    if (options.username.length <= 3) {
        return [{
            field: "password",
            message: "length must be greater than 3",
        }]

    }

    if (options.username.includes("@")) {
        return [{
            field: "username",
            message: "Username cannot include @",
        }]

    }

    if (options.password.length < 5) {
        return [{
            field: "password",
            message: "Password must be at least 5 characters"
        }]
    }

    const existing = await p.user.findFirst({
        where: {
            username: options.username
        }
    })

    if (existing) {
        return [{
            field: 'username',
            message: 'Username already exists'
        }]

    }

    if (!options.email.includes("@")) {
        return [{
            field: 'email',
            message: "Email address not in valid format",
        }]
    }


    return null;
}

export default validateRegister;