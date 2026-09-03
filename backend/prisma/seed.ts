import "dotenv/config";
import bcrypt from "bcrypt";
import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@example.com";
const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "ChangeMeAdmin123!";
const employeePassword = process.env.SEED_EMPLOYEE_PASSWORD ?? "ChangeMeEmployee123!";

const users = [
  { name: "Admin", email: adminEmail, role: Role.ADMIN, password: adminPassword },
  { name: "Ahmed", email: "ahmed@example.com", role: Role.EMPLOYEE, password: employeePassword },
  { name: "Ali", email: "ali@example.com", role: Role.EMPLOYEE, password: employeePassword },
  { name: "Hassan", email: "hassan@example.com", role: Role.EMPLOYEE, password: employeePassword }
];

async function main() {
  for (const user of users) {
    const passwordHash = await bcrypt.hash(user.password, 12);

    await prisma.user.upsert({
      where: { email: user.email },
      update: {
        name: user.name,
        role: user.role,
        passwordHash
      },
      create: {
        name: user.name,
        email: user.email,
        role: user.role,
        passwordHash
      }
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
