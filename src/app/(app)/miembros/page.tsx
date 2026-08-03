import { format } from "date-fns";

import { prisma } from "@/lib/prisma";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

const STATUS_VARIANT = {
  ACTIVE: "default",
  INACTIVE: "secondary",
  SUSPENDED: "destructive",
} as const;

export default async function MiembrosPage() {
  const members = await prisma.member.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      memberships: {
        orderBy: { createdAt: "desc" },
        take: 1,
        include: { plan: true },
      },
    },
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold">Miembros</h1>
        <p className="text-sm text-muted-foreground">
          {members.length} miembro{members.length === 1 ? "" : "s"} registrado
          {members.length === 1 ? "" : "s"}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Listado de miembros</CardTitle>
          <CardDescription>
            Miembros del gimnasio y su membresia mas reciente
          </CardDescription>
        </CardHeader>
        <CardContent>
          {members.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Aun no hay miembros registrados.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Codigo</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Contacto</TableHead>
                  <TableHead>Plan actual</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Registrado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member) => {
                  const currentMembership = member.memberships[0];
                  return (
                    <TableRow key={member.id}>
                      <TableCell className="font-mono text-xs">
                        {member.code}
                      </TableCell>
                      <TableCell className="font-medium">
                        {member.firstName} {member.lastName}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{member.email ?? "-"}</span>
                          <span className="text-xs text-muted-foreground">
                            {member.phone ?? "-"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {currentMembership
                          ? currentMembership.plan.name
                          : "Sin plan"}
                      </TableCell>
                      <TableCell>
                        <Badge variant={STATUS_VARIANT[member.status]}>
                          {member.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {format(member.createdAt, "dd/MM/yyyy")}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
