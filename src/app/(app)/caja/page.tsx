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

const currency = new Intl.NumberFormat("es-DO", {
  style: "currency",
  currency: "DOP",
});

export default async function CajaPage() {
  const registers = await prisma.cashRegister.findMany({
    orderBy: { name: "asc" },
    include: {
      sessions: {
        orderBy: { openedAt: "desc" },
        take: 1,
        include: { openedBy: true },
      },
    },
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold">Caja</h1>
        <p className="text-sm text-muted-foreground">
          Estado actual de las cajas registradoras
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cajas registradoras</CardTitle>
          <CardDescription>
            Ultima sesion abierta o cerrada por caja
          </CardDescription>
        </CardHeader>
        <CardContent>
          {registers.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Aun no hay cajas registradas.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Caja</TableHead>
                  <TableHead>Ubicacion</TableHead>
                  <TableHead>Responsable</TableHead>
                  <TableHead>Apertura</TableHead>
                  <TableHead>Monto inicial</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {registers.map((register) => {
                  const session = register.sessions[0];
                  return (
                    <TableRow key={register.id}>
                      <TableCell className="font-medium">
                        {register.name}
                      </TableCell>
                      <TableCell>{register.location ?? "-"}</TableCell>
                      <TableCell>{session?.openedBy.name ?? "-"}</TableCell>
                      <TableCell>
                        {session
                          ? format(session.openedAt, "dd/MM/yyyy HH:mm")
                          : "-"}
                      </TableCell>
                      <TableCell>
                        {session
                          ? currency.format(Number(session.openingAmount))
                          : "-"}
                      </TableCell>
                      <TableCell>
                        {session ? (
                          <Badge
                            variant={
                              session.status === "OPEN"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {session.status === "OPEN" ? "Abierta" : "Cerrada"}
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Sin sesiones</Badge>
                        )}
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
