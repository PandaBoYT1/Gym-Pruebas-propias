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
  ON_LEAVE: "outline",
} as const;

export default async function PersonalPage() {
  const staff = await prisma.staff.findMany({
    orderBy: { hireDate: "desc" },
    include: { user: true },
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold">Personal</h1>
        <p className="text-sm text-muted-foreground">
          {staff.length} miembro{staff.length === 1 ? "" : "s"} del equipo
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Equipo</CardTitle>
          <CardDescription>
            Empleados, posicion y estado actual
          </CardDescription>
        </CardHeader>
        <CardContent>
          {staff.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Aun no hay personal registrado.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Codigo</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Posicion</TableHead>
                  <TableHead>Contacto</TableHead>
                  <TableHead>Contratado</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {staff.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="font-mono text-xs">
                      {member.employeeCode}
                    </TableCell>
                    <TableCell className="font-medium">
                      {member.user.name}
                    </TableCell>
                    <TableCell>{member.position}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{member.user.email}</span>
                        <span className="text-xs text-muted-foreground">
                          {member.phone ?? "-"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {format(member.hireDate, "dd/MM/yyyy")}
                    </TableCell>
                    <TableCell>
                      <Badge variant={STATUS_VARIANT[member.status]}>
                        {member.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
