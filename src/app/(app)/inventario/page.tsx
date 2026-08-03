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

export default async function InventarioPage() {
  const products = await prisma.product.findMany({
    where: { active: true },
    orderBy: { name: "asc" },
    include: { category: true },
  });

  const lowStockCount = products.filter((p) => p.stock <= p.minStock).length;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold">Inventario</h1>
        <p className="text-sm text-muted-foreground">
          {products.length} producto{products.length === 1 ? "" : "s"} activo
          {products.length === 1 ? "" : "s"}
          {lowStockCount > 0 &&
            ` - ${lowStockCount} con stock bajo`}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Productos</CardTitle>
          <CardDescription>Stock y precios de venta</CardDescription>
        </CardHeader>
        <CardContent>
          {products.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Aun no hay productos registrados.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SKU</TableHead>
                  <TableHead>Producto</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead>Stock</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => {
                  const isLowStock = product.stock <= product.minStock;
                  return (
                    <TableRow key={product.id}>
                      <TableCell className="font-mono text-xs">
                        {product.sku}
                      </TableCell>
                      <TableCell className="font-medium">
                        {product.name}
                      </TableCell>
                      <TableCell>{product.category?.name ?? "-"}</TableCell>
                      <TableCell>
                        {currency.format(Number(product.price))}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span>
                            {product.stock} {product.unit}
                          </span>
                          {isLowStock && (
                            <Badge variant="destructive">Stock bajo</Badge>
                          )}
                        </div>
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
