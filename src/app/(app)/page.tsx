import { Users, UserCog, PackageX, Wallet } from "lucide-react";

import { prisma } from "@/lib/prisma";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const MEMBER_STATUS_VARIANT = {
  ACTIVE: "default",
  INACTIVE: "secondary",
  SUSPENDED: "destructive",
} as const;

export default async function DashboardPage() {
  const [activeMembers, activeStaff, openCashSessions, products, recentMembers] =
    await Promise.all([
      prisma.member.count({ where: { status: "ACTIVE" } }),
      prisma.staff.count({ where: { status: "ACTIVE" } }),
      prisma.cashSession.count({ where: { status: "OPEN" } }),
      prisma.product.findMany({ where: { active: true } }),
      prisma.member.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ]);

  const lowStockCount = products.filter((p) => p.stock <= p.minStock).length;

  const stats = [
    {
      label: "Miembros activos",
      value: activeMembers,
      icon: Users,
    },
    {
      label: "Personal activo",
      value: activeStaff,
      icon: UserCog,
    },
    {
      label: "Stock bajo",
      value: lowStockCount,
      icon: PackageX,
    },
    {
      label: "Cajas abiertas",
      value: openCashSessions,
      icon: Wallet,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Resumen general del gimnasio
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader>
              <CardDescription className="flex items-center gap-2">
                <stat.icon className="size-4" />
                {stat.label}
              </CardDescription>
              <CardTitle className="text-2xl">{stat.value}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Miembros recientes</CardTitle>
          <CardDescription>Ultimos registros en el sistema</CardDescription>
        </CardHeader>
        <CardContent>
          {recentMembers.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Aun no hay miembros registrados.
            </p>
          ) : (
            <ul className="flex flex-col gap-3">
              {recentMembers.map((member) => (
                <li
                  key={member.id}
                  className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="text-sm font-medium">
                      {member.firstName} {member.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {member.code}
                    </p>
                  </div>
                  <Badge variant={MEMBER_STATUS_VARIANT[member.status]}>
                    {member.status}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
