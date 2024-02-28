import { AfterViewInit, Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Producto } from "app/Models/producto";
import { ToastrService } from "ngx-toastr";
import { HttpClient } from "@angular/common/http";
import { CodigoBarrasService } from "../../Services/codigo.service";
import { ProductoService } from "app/Services/producto.service";
import { ResponseProduct } from "app/Models/InterfacesProducts";

@Component({
  selector: "app-lista-factura",
  templateUrl: "./lista-factura.component.html",
  styleUrls: ["./lista-factura.component.scss"],
})
export class ListaFacturaComponent implements OnInit, AfterViewInit {
  listProductos: Producto[] = [];
  busqueda: string = "";
  filtrarProductos: Producto[] = []; // Productos filtrados
  todosLosProductos: Producto[] = []; // Mantén una copia de seguridad de todos los productos
  productoSeleccionado: any = null;
  busquedaInicial: string = "";
  busquedaActual: string = "";
  tresD: any;
  get productosFiltrados() {
    return this.listProductos.filter((producto) =>
      producto.nombre.toLowerCase().includes(this.busqueda.toLowerCase())
    );
  }
  constructor(
    private toastr: ToastrService,
    private http: HttpClient,
    private codigoBarrasService: CodigoBarrasService,
    private router: Router,
    private prodService: ProductoService,
  ) {}
  ngAfterViewInit(): void {
    var _thisDoc = this;
    $("#producto-tableGCB").on("click", "#EditarProductoGCB", function (data) {
      let datas = $("#producto-tableGCB")
        .DataTable()
        .row($(this).parents("tr"))
        .data() as ResponseProduct;
        console.log(datas)

       _thisDoc.editarProducto(datas.ID.toString())
    });
  }

  dtOptionsGCB: DataTables.Settings = {};

  InitializateTableGCB() {
    this.dtOptionsGCB = {
      ajax: (dataTablesParameters: any, callback) => {
        this.prodService.getProductosCategoria().subscribe((data) => {
          callback({ data: data.data });
        });
      },
      language: {
        url: "https://cdn.datatables.net/plug-ins/1.13.1/i18n/es-ES.json",
      },
      columns: [
        {
          title: "ID",
          data: "ID",
        },
        {
          title: "Nombre",
          data: "Nombre",
        },
        {
          title: "Imagen",
          data: "ImgUrl",
          render: function (data) {
            return `<img src="${data}" width="150" height="150" class="rounded mx-auto d-block" alt="No se puede mostrar la imágen">`;
          },
        },
        // {
        //   title: "Precio",
        //   data: "Precio",
        //   render: $.fn.dataTable.render.number(",", ".", 2, "$"),
        //   type: "currency",
        // },
        {
          title: "Codigo",
          data: "Codigo",
        },
        {
          title: "Peso",
          data: "Peso",
          render: $.fn.dataTable.render.number(",", ".", 4),
        },
      ],
      columnDefs: [
        {
          targets: 5,
          title: "Estado",
          data: "Estado",
          render: function (data, type, row) {
            return data == 1
              ? `<span class="badge bg-info">Activo</span>`
              : `<span class="badge bg-danger">Inactivo</span>`;
          },
        },
        {
          targets: 6,
          title: "Opciones",
          data: null,
          render: function (data, type, row) {
            return `<button
              #Editar
            id="EditarProductoGCB"
            type="button"
            class="btn btn-info btn-sm"
            
          >
            <i class="nc-icon nc-cart-simple"></i>
          </button>
  
          </button>`;
          },
        },
      ],
    };
  }

  ngOnInit(): void {
    this.busquedaInicial = this.busqueda;
    this.busquedaActual = this.busqueda;
    this.InitializateTableGCB();
  }

  //editarProducto(producto: any)
  editarProducto(id: string) {
    this.router.navigate(["/editar-producto", id]);
    
  }


  actualizarProductosFiltrados() {
    this.filtrarProductos = this.listProductos.filter((producto) =>
      producto.nombre.toLowerCase().includes(this.busquedaActual.toLowerCase())
    );
  }

  actualizarBusqueda(nuevaBusqueda: string) {
    this.busquedaActual = nuevaBusqueda;
    this.actualizarProductosFiltrados();
  }

  generarCodigoBarras(codigo: string, peso: number, precio: number): string {
    return this.codigoBarrasService.calcularCodigoBarras(codigo, peso, precio);
  }

}
