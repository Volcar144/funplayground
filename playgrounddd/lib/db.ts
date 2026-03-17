    import { PrismaClient, Prisma } from "@/generated/prisma/client";
    import { PrismaPg } from "@prisma/adapter-pg";

    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL!,
    });

    export const prisma = new PrismaClient({ adapter });

    //Cache the instance
    async function main(){
      await prisma.user.count;
    }

    main()

    export const PrismaD = Prisma