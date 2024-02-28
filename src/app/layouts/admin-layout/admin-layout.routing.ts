import { Routes } from "@angular/router";

import { DashboardComponent } from "../../pages/dashboard/dashboard.component";
import { UserComponent } from "../../pages/user/user.component";
import { IconsComponent } from "../../pages/icons/icons.component";
import { NotificationsComponent } from "../../pages/notifications/notifications.component";
import { ClienteComponent } from "../../pages/cliente/cliente.component";
import { UsuarioComponent } from "../../pages/usuario/usuario.component";
import { ProductoComponent } from "../../pages/producto/producto.component";
import { Producto2Component } from "../../pages/producto2/producto2.component";
import { ListaFacturaComponent } from "../../pages/lista-factura/lista-factura.component";
import { CrearFacturaComponent } from "../../pages/crear-factura/crear-factura.component";
import { VerFacturaComponent } from "../../pages/ver-factura/ver-factura.component";
import { MiPerfilComponent } from "../../pages/mi-perfil/mi-perfil.component";
import { AuthGuard } from "../../Guards/auth.guard";
import { EditarProductoComponent } from "app/pages/editar-producto/editar-producto.component";

export const AdminLayoutRoutes: Routes = [
  {
    path: "dashboard",
    canActivate: [AuthGuard],
    component: DashboardComponent,
  },
  { path: "clientes", canActivate: [AuthGuard], component: ClienteComponent },
  { path: "usuarios", canActivate: [AuthGuard], component: UsuarioComponent },
  { path: "productos", canActivate: [AuthGuard], component: ProductoComponent },
  //{ path: "productos2", canActivate: [AuthGuard], component: Producto2Component },
  {
    path: "crearFactura",
    canActivate: [AuthGuard],
    component: CrearFacturaComponent,
  },
  {
    path: "generarCBR",
    canActivate: [AuthGuard],
    component: ListaFacturaComponent,
  },
  {
    path: "verFactura/:id",
    canActivate: [AuthGuard],
    component: VerFacturaComponent,
  },
  { path: 'editar-producto/:id', component: EditarProductoComponent },

  { path: "miperfil", canActivate: [AuthGuard], component: MiPerfilComponent },
];
