import { Component, OnInit } from "@angular/core";

export interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}

export const ROUTESADM: RouteInfo[] = [
  { path: "/dashboard", title: "Inicio", icon: "nc-bank", class: "" },
  {
    path: "/miperfil",
    title: "Mi Perfil",
    icon: "nc-icon nc-album-2",
    class: "",
  },
  { path: "/clientes", title: "Colaboradores", icon: "nc-single-02", class: "" },
  {
    path: "/usuarios",
    title: "Usuarios",
    icon: "nc-icon nc-book-bookmark",
    class: "",
  },
  {
    path: "/productos",
    title: "Productos",
    icon: "nc-icon nc-tag-content",
    class: "",
  },

  {
    path: "/productos2",
    title: "Productos2",
    icon: "nc-icon nc-tag-content",
    class: "",
  },
  /*{
    path: "/crearFactura",
    title: "Facturar",
    icon: "nc-icon nc-delivery-fast",
    class: "",
  },*/
  {
    path: "/generarCBR",
    title: "Generar Codigo",
    icon: "nc-tile-56",
    class: "",
  },
  
];

export const ROUTESUSUARIO: RouteInfo[] = [
  { path: "/dashboard", title: "Inicio", icon: "nc-bank", class: "" },
  {
    path: "/miperfil",
    title: "Mi Perfil",
    icon: "nc-icon nc-album-2",
    class: "",
  },
  { path: "/clientes", title: "Clientes", icon: "nc-single-02", class: "" },
  {
    path: "/productos",
    title: "Productos",
    icon: "nc-icon nc-tag-content",
    class: "",
  },
  {
    path: "/productos2",
    title: "Productos2",
    icon: "nc-icon nc-tag-content",
    class: "",
  }/*
  {
    path: "/crearFactura",
    title: "Facturar",
    icon: "nc-icon nc-delivery-fast",
    class: "",
  },
  {
    path: "/generarCBR",
    title: "Lista Facturas",
    icon: "nc-tile-56",
    class: "",
  },*/

 
];

export const ROUTESCLIENTE: RouteInfo[] = [
  { path: "/dashboard", title: "Inicio", icon: "nc-bank", class: "" },
  { path: "/table", title: "Lista Facturas", icon: "nc-tile-56", class: "" },
];

@Component({
  moduleId: module.id,
  selector: "sidebar-cmp",
  templateUrl: "sidebar.component.html",
})
export class SidebarComponent implements OnInit {
  public menuItems: any[];
  ngOnInit() {
    const rol = JSON.parse(localStorage.getItem("rol"));
    switch (rol) {
      case "Admin":
        this.menuItems = ROUTESADM.filter((menuItem) => menuItem);
        break;
      case "User":
        this.menuItems = ROUTESUSUARIO.filter((menuItem) => menuItem);
        break;
    }
  }
}
