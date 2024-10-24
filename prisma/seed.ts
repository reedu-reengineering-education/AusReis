import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  const umut = await prisma.user.upsert({
    where: { email: "u.tas@reedu.de" },
    update: {},
    create: {
      email: "u.tas@reedu.de",
      name: "Umut Tas",
      role: "admin",
      password: "",
    },
  });
  const ronja = await prisma.user.upsert({
    where: { email: "r.federer@reedu.de" },
    update: {},
    create: {
      email: "r.federer@reedu.de",
      name: "Ronja Federer",
      role: "admin",
      password: "",
    },
  });
  console.log({ umut, ronja });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
