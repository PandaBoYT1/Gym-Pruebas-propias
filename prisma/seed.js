const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  // Limpieza en orden seguro para FKs (datos de desarrollo local, no producción)
  await prisma.payment.deleteMany();
  await prisma.stockMovement.deleteMany();
  await prisma.saleItem.deleteMany();
  await prisma.cashMovement.deleteMany();
  await prisma.sale.deleteMany();
  await prisma.cashSession.deleteMany();
  await prisma.cashRegister.deleteMany();
  await prisma.trainerAssignment.deleteMany();
  await prisma.checkIn.deleteMany();
  await prisma.membership.deleteMany();
  await prisma.membershipPlan.deleteMany();
  await prisma.member.deleteMany();
  await prisma.staffAttendance.deleteMany();
  await prisma.shift.deleteMany();
  await prisma.staff.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("admin123", 10);

  const admin = await prisma.user.create({
    data: {
      email: "admin@gymsistem.com",
      passwordHash,
      name: "Admin Principal",
      role: "ADMIN",
    },
  });

  await prisma.user.create({
    data: {
      email: "carlos.trainer@gymsistem.com",
      passwordHash,
      name: "Carlos Ramirez",
      role: "TRAINER",
      staff: {
        create: {
          employeeCode: "EMP-001",
          position: "TRAINER",
          hireDate: new Date("2024-02-01"),
          phone: "809-123-4567",
          status: "ACTIVE",
        },
      },
    },
  });

  await prisma.user.create({
    data: {
      email: "maria.recepcion@gymsistem.com",
      passwordHash,
      name: "Maria Fernandez",
      role: "RECEPTIONIST",
      staff: {
        create: {
          employeeCode: "EMP-002",
          position: "RECEPTIONIST",
          hireDate: new Date("2024-05-15"),
          phone: "809-765-4321",
          status: "ACTIVE",
        },
      },
    },
  });

  await prisma.user.create({
    data: {
      email: "luis.mantenimiento@gymsistem.com",
      passwordHash,
      name: "Luis Gomez",
      role: "RECEPTIONIST",
      staff: {
        create: {
          employeeCode: "EMP-003",
          position: "MAINTENANCE",
          hireDate: new Date("2023-11-10"),
          phone: "809-555-0000",
          status: "ON_LEAVE",
        },
      },
    },
  });

  const [mensual, trimestral, anual, pase] = await Promise.all([
    prisma.membershipPlan.create({
      data: {
        name: "Mensual",
        type: "MONTHLY",
        durationDays: 30,
        price: 1200,
        description: "Acceso completo por 30 dias",
      },
    }),
    prisma.membershipPlan.create({
      data: {
        name: "Trimestral",
        type: "QUARTERLY",
        durationDays: 90,
        price: 3200,
        description: "Acceso completo por 90 dias",
      },
    }),
    prisma.membershipPlan.create({
      data: {
        name: "Anual",
        type: "ANNUAL",
        durationDays: 365,
        price: 11000,
        description: "Acceso completo por 12 meses",
      },
    }),
    prisma.membershipPlan.create({
      data: {
        name: "Pase Diario",
        type: "DAY_PASS",
        durationDays: 1,
        price: 150,
        description: "Acceso por un dia",
      },
    }),
  ]);

  const today = new Date();
  const inDays = (n) => new Date(today.getTime() + n * 24 * 60 * 60 * 1000);

  const membersData = [
    {
      code: "MEM-0001",
      firstName: "Jose",
      lastName: "Martinez",
      email: "jose.martinez@example.com",
      phone: "809-111-2222",
      status: "ACTIVE",
      plan: mensual,
      start: inDays(-10),
      end: inDays(20),
    },
    {
      code: "MEM-0002",
      firstName: "Ana",
      lastName: "Perez",
      email: "ana.perez@example.com",
      phone: "809-222-3333",
      status: "ACTIVE",
      plan: anual,
      start: inDays(-60),
      end: inDays(305),
    },
    {
      code: "MEM-0003",
      firstName: "Luis",
      lastName: "Diaz",
      email: "luis.diaz@example.com",
      phone: "809-333-4444",
      status: "ACTIVE",
      plan: trimestral,
      start: inDays(-5),
      end: inDays(85),
    },
    {
      code: "MEM-0004",
      firstName: "Carla",
      lastName: "Nunez",
      email: "carla.nunez@example.com",
      phone: "809-444-5555",
      status: "SUSPENDED",
      plan: mensual,
      start: inDays(-40),
      end: inDays(-10),
    },
    {
      code: "MEM-0005",
      firstName: "Pedro",
      lastName: "Santos",
      email: "pedro.santos@example.com",
      phone: "809-555-6666",
      status: "INACTIVE",
      plan: null,
      start: null,
      end: null,
    },
    {
      code: "MEM-0006",
      firstName: "Rosa",
      lastName: "Guzman",
      email: "rosa.guzman@example.com",
      phone: "809-666-7777",
      status: "ACTIVE",
      plan: pase,
      start: today,
      end: inDays(1),
    },
  ];

  for (const m of membersData) {
    const member = await prisma.member.create({
      data: {
        code: m.code,
        firstName: m.firstName,
        lastName: m.lastName,
        email: m.email,
        phone: m.phone,
        status: m.status,
      },
    });

    if (m.plan) {
      await prisma.membership.create({
        data: {
          memberId: member.id,
          planId: m.plan.id,
          startDate: m.start,
          endDate: m.end,
          status: m.status === "SUSPENDED" ? "FROZEN" : "ACTIVE",
        },
      });
    }
  }

  const suplementos = await prisma.category.create({
    data: { name: "Suplementos" },
  });
  const accesorios = await prisma.category.create({
    data: { name: "Accesorios" },
  });

  await prisma.product.createMany({
    data: [
      {
        sku: "SUP-001",
        name: "Proteina Whey 2lb",
        categoryId: suplementos.id,
        price: 1800,
        cost: 1200,
        stock: 8,
        minStock: 5,
        unit: "unidad",
      },
      {
        sku: "SUP-002",
        name: "Bebida Hidratante 500ml",
        categoryId: suplementos.id,
        price: 120,
        cost: 60,
        stock: 3,
        minStock: 10,
        unit: "unidad",
      },
      {
        sku: "ACC-001",
        name: "Toalla Deportiva",
        categoryId: accesorios.id,
        price: 350,
        cost: 180,
        stock: 15,
        minStock: 5,
        unit: "unidad",
      },
      {
        sku: "ACC-002",
        name: "Guantes de Entrenamiento",
        categoryId: accesorios.id,
        price: 650,
        cost: 400,
        stock: 2,
        minStock: 6,
        unit: "par",
      },
    ],
  });

  const register = await prisma.cashRegister.create({
    data: { name: "Caja Principal", location: "Recepcion" },
  });

  await prisma.cashSession.create({
    data: {
      cashRegisterId: register.id,
      openedById: admin.id,
      openingAmount: 2000,
      status: "OPEN",
    },
  });

  console.log("Seed completado.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
