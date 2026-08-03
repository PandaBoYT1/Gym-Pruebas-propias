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

export default async function MembresiasPage() {
  const plans = await prisma.membershipPlan.findMany({
    orderBy: { price: "asc" },
    include: {
      _count: {
        select: {
          memberships: { where: { status: "ACTIVE" } },
        },
      },
    },
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold">Membresias</h1>
        <p className="text-sm text-muted-foreground">
          Planes disponibles y miembros activos por plan
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Planes de membresia</CardTitle>
          <CardDescription>
            {plans.length} plan{plans.length === 1 ? "" : "es"} configurado
            {plans.length === 1 ? "" : "s"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {plans.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Aun no hay planes de membresia configurados.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Plan</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Duracion</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead>Miembros activos</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {plans.map((plan) => (
                  <TableRow key={plan.id}>
                    <TableCell className="font-medium">{plan.name}</TableCell>
                    <TableCell>{plan.type}</TableCell>
                    <TableCell>{plan.durationDays} dias</TableCell>
                    <TableCell>{currency.format(Number(plan.price))}</TableCell>
                    <TableCell>{plan._count.memberships}</TableCell>
                    <TableCell>
                      <Badge variant={plan.active ? "default" : "secondary"}>
                        {plan.active ? "Activo" : "Inactivo"}
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
