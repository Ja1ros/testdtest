import {
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChild,
} from "@angular/core";
import { DataTableDirective } from "angular-datatables";
import {
  Cliente,
  ProductoPost,
  Productos,
  RootFactPost,
} from "app/Models/InterfaceFactura";
import { ICliente, IRespCliente } from "app/Models/InterfacesClients";
import { ClienteService } from "app/Services/cliente.service";
import { ProductoService } from "app/Services/producto.service";

import Swal from "sweetalert2";
import { FacturaService } from "../../Services/factura.service";

@Component({
  selector: "app-crear-factura",
  templateUrl: "./crear-factura.component.html",
  styleUrls: ["./crear-factura.component.scss"],
})
export class CrearFacturaComponent implements OnInit {
  constructor(
    private clienteService: ClienteService,
    private prodService: ProductoService,
    private facturaService: FacturaService
  ) {}

  /**/
  ClienteSelected: Cliente = {};
  productoSeleccionado: Productos = {};
  RootFactPost: RootFactPost = { Subtotal: 0, IVA: 0, Total: 0 };
  ProductosPost: ProductoPost[] = [];
  /**/

  clientSelect: boolean = false;
  save: boolean = false;
  productSelect: boolean = false;

  @ViewChild("closeModalClientes") editar: ElementRef;
  @ViewChild("closeModalProductos") cerrarProducto: ElementRef;
  @ViewChild("ProductosModal") abriModalProductos: ElementRef;

  @ViewChild(DataTableDirective, { static: true })
  dtElement: DataTableDirective;

  @ViewChild("ModalClientes")
  dtElement1: DataTableDirective;
  @ViewChild("ModalProductos")
  dtElement2: DataTableDirective;

  dtOptionsClFac: DataTables.Settings = {};
  dtOptionsPrFac: DataTables.Settings = {};

  public precioP: string = "";
  public cantidad: string = "";

  ngOnInit(): void {
    this.dtOptionsClFac = {
      ajax: (dataTablesParameters: any, callback) => {
        this.clienteService.getClientesFac().subscribe((data: IRespCliente) => {
          callback({ data: data.data });
        });
      },
      language: {
        url: "https://cdn.datatables.net/plug-ins/1.13.1/i18n/es-ES.json",
      },
      columns: [
        {
          title: "Cédula",
          data: "CedRuc",
        },
        {
          title: "Nombres",
          data: "Nombres",
        },
        {
          title: "Apellidos",
          data: "Apellidos",
        },
        {
          title: "Teléfono",
          data: "Telefono",
        },
        {
          title: "Dirección",
          data: "Direccion",
        },
      ],
      columnDefs: [
        {
          targets: 5,
          title: "Seleccionar",
          data: null,
          render: function (data, type, row) {
            return `<button
            #Editar
          id="Editar"
          type="button"
          class="btn btn-info btn-sm"
         
        >
          Seleccionar
        </button>

        `;
          },
        },
      ],
    };

    ////

    this.dtOptionsPrFac = {
      ajax: (dataTablesParameters: any, callback) => {
        this.prodService.getProductosFac().subscribe((data) => {
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
          title: "Precio",
          data: "Precio",
          render: $.fn.dataTable.render.number(",", ".", 2, "$ "),
          type: "currency",
        },
        {
          title: "Stock",
          data: "Stock",
        },
      ],
      columnDefs: [
        {
          targets: 4,
          title: "Seleccionar",
          data: null,
          render: function (data, type, row) {
            return `<button
            
          id="SeleccionarProducto"
          type="button"
          class="btn btn-info btn-sm"
          
        >
          Seleccionar
        </button>

        `;
          },
        },
      ],
    };
  }

  private async reloadTable() {
    let dtIntance = await this.dtElement.dtInstance;
    dtIntance.ajax.reload();
  }


  async reloadClientes() {
    let dtIntance = await this.dtElement.dtInstance;
    dtIntance.ajax.reload();
    
  }

 

  @ViewChild("precio") input: ElementRef | any;

  async SeleccionarProducto(producto: Productos) {
    this.productoSeleccionado = producto;
    this.input.nativeElement.focus();
    this.productSelect = true;

    await this.reloadTable()
  }

  ngAfterViewInit(): void {
    var _thisDoc = this;
    $("#clientFac-table").on("click", "#Editar", function (data) {
      _thisDoc.editar.nativeElement.click(); //<-- here
      let datas = $("#clientFac-table")
        .DataTable()
        .row($(this).parents("tr"))
        .data() as ICliente;

      // _thisDoc.ClienteSelected = datas;
      _thisDoc.SeleccionarCliente(datas);
    });

    $("#productFac-table").on("click", "#SeleccionarProducto", function (data) {
      let datas = $("#productFac-table")
        .DataTable()
        .row($(this).parents("tr"))
        .data() as ICliente;

      _thisDoc.cerrarProducto.nativeElement.click(); //<-- here
      _thisDoc.SeleccionarProducto(datas);
      //  console.log(datas)
      // _thisDoc.ClienteSelected = datas;
      //_thisDoc.SeleccionarCliente(datas);
    });
  }

  async SeleccionarCliente(cliente: Cliente) {
    this.RootFactPost.IdCliente = cliente.ID;
    this.ClienteSelected = cliente;
    this.clientSelect = true;

    await this.reloadClientes();
  }

  onlyNumber(event: any) {
    return event.charCode == 8 || event.charCode == 0
      ? null
      : event.charCode >= 48 && event.charCode <= 57;
  }

  showMessage(icon: any, title: any, text: any) {
    Swal.fire({
      showCloseButton: true,
      position: "center",
      icon: icon,
      title: title,
      text: text,
      showConfirmButton: false,
      timer: 3000,
    });
  }

  GuardarFactura() {
    this.RootFactPost.Productos = this.ProductosPost;
    this.facturaService
      .PostFactura(this.RootFactPost)
      .subscribe((response: any) => {
        console.warn(response);
        this.Cancelar();
        const swalWithBootstrapButtons = Swal.mixin({
          customClass: {
            confirmButton: "btn btn-success",
            cancelButton: "btn btn-danger",
          },
          buttonsStyling: false,
        });
        swalWithBootstrapButtons
          .fire("Guardado!", "Su Factura fue guardada!", "success")
          .then(async (result) => {
            if (result.isConfirmed) {
              console.log("first");
              
              await this.reloadClientes();
              await this.reloadTable()
            }
          });

        //this.dtTrigger.next(this.clientes);
      });
    console.log(this.RootFactPost);
  }

  AgregarProducto() {
    if (!this.productoSeleccionado.ID) {
      this.showMessage("info", "Alerta Sistema", "Ingrese el Producto");
      return;
    }

    if (!this.cantidad) {
      this.showMessage("info", "Alerta Sistema", "Ingrese la Cantidad");
      this.input.nativeElement.focus();
      return;
    }

    const cant = Number(this.cantidad);

    if (cant == 0) {
      this.showMessage(
        "error",
        "Alerta Sistema",
        "Ingrese una cantidad diferente"
      );
      this.input.nativeElement.focus();
      this.LimpiarCantidad();
      return;
    }

    if (this.setItemEdit) {
      // Verificar Stock Nuevo Producto
      if (cant > this.productoSeleccionado.Stock!) {
        this.showMessage(
          "info",
          "Stock Producto",
          `La cantidad ${cant} es mayor que el Stock Disponible ${this.productoSeleccionado.Stock}`
          //'La cantidad ingresada es mayor que el Stock Disponible '
        );
        return;
      }

      // Verificar
      // Editar
      const id = this.ProductosPost.findIndex(
        (x) => x.Id_Pro == this.productoEditar.Id_Pro
      );

      if (id == -1) {
        this.showMessage(
          "error",
          `Producto ${this.productoEditar.Nombre}`,
          "No se Encontro el producto"
        );
        return;
      }

      // Verificar si el nuevo producto existe en la lista
      const idx = this.ProductosPost.findIndex(
        (x) => x.Id_Pro == this.productoSeleccionado.ID
      );

      if (idx == -1) {
        // No existe
        // reemplazar
        this.ProductosPost[id].Id_Pro = this.productoSeleccionado.ID;
        this.ProductosPost[id].Nombre = this.productoSeleccionado.Nombre;
        this.ProductosPost[id].Cantidad = cant;
        this.ProductosPost[id].Precio = this.productoSeleccionado.Precio;
        this.ProductosPost[id].Subtotal =
          cant * this.productoSeleccionado.Precio!;

        this.showMessage(
          "info",
          "Finalizado",
          "El Producto fue editado exitosamente"
        );
      } else {
        //existe en la lista

        const c = cant; // this.ProductosPost[idx].Cantidad!;
        this.showMessage(
          "info",
          "Finalizado",
          "El Producto fue editado exitosamente"
        );
        // console.warn(c);
        // console.warn(this.ProductosPost[idx].Cantidad!);
        // console.warn(cant);
        // console.warn(idx);
        // console.warn(id);

        if (c > this.productoSeleccionado.Stock!) {
          this.showMessage(
            "info",
            "Stock Producto",
            `La nueva cantidad ${c} es mayor que el Stock Disponible ${this.productoSeleccionado.Stock}`
          );
          this.cantidad = "";
          this.input.nativeElement.focus();
          return;
        }

        this.ProductosPost[idx].Cantidad = c;
        this.ProductosPost[idx].Subtotal =
          c * this.productoSeleccionado.Precio!;

        // console.warn(id);
        // console.warn(idx);

        if (id != idx) {
          this.ProductosPost.splice(id, 1);
        }
      }
    } else {
      const id = this.ProductosPost.findIndex(
        (x) => x.Id_Pro == this.productoSeleccionado.ID
      );

      if (id == -1) {
        if (
          this.productoSeleccionado.Precio &&
          this.productoSeleccionado.Stock
        ) {
          if (cant > this.productoSeleccionado.Stock) {
            this.showMessage(
              "info",
              "Stock Producto",
              `La cantidad ${cant} es mayor que el Stock Disponible ${this.productoSeleccionado.Stock}`
            );
            return;
          }

          const precio = this.productoSeleccionado.Precio;
          this.ProductosPost.push({
            Id_Pro: this.productoSeleccionado.ID,
            Nombre: this.productoSeleccionado.Nombre,
            Cantidad: cant,
            Precio: this.productoSeleccionado.Precio,
            Subtotal: cant * precio,
          });
        }
      } else {
        /* Aumentar la Cantidad */
        const c = this.ProductosPost[id].Cantidad! + cant;

        if (c > this.productoSeleccionado.Stock!) {
          this.showMessage(
            "info",
            "Stock Producto",
            `La nueva cantidad ${c} es mayor que el Stock Disponible ${this.productoSeleccionado.Stock}`
          );
          this.cantidad = "";
          this.input.nativeElement.focus();
          return;
        }
        this.ProductosPost[id].Cantidad = c;
        this.ProductosPost[id].Subtotal = c * this.productoSeleccionado.Precio!;
        this.showMessage("info", "Finalizado", "Nueva cantidad del Producto");
        // const p = this.ProductosPost.find(x=>x.Id_Pro ==)
      }
    }

    this.Limpiar();
    this.CalcularValores();
    this.SaveBool();
    this.productSelect = false;
    this.setItemEdit = false;
  }

  setItemEdit: boolean = false;
  productoEditar: ProductoPost = {};

  editarItem(item: ProductoPost) {
    // Mostrar el modal de
    this.productoEditar = item;
    this.setItemEdit = true;
    this.abriModalProductos.nativeElement.click();
  }

  eliminarItem(producto: ProductoPost) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger",
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: "Esta seguro de Eliminar?",
        text: `Eliminar el Producto ${producto.Nombre}!`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Si",
        cancelButtonText: "No",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          const id = this.ProductosPost.findIndex(
            (x) => x.Id_Pro == producto.Id_Pro
          );
          this.ProductosPost.splice(id, 1);
          this.CalcularValores();
          this.SaveBool();
          swalWithBootstrapButtons.fire(
            "Eliminado!",
            "El item fue eliminado",
            "success"
          );
        }
      });
  }

  private Limpiar() {
    this.productoSeleccionado = {};
    this.cantidad = "";
  }

  private LimpiarCantidad() {
    this.cantidad = "";
  }

  Cancelar() {
    this.RootFactPost = {};
    this.ProductosPost = [];
    this.ClienteSelected = {};
    this.CalcularValores();
    this.clientSelect = false;
    this.productSelect = false;
    this.save = false;
    this.Limpiar();
  }

  private SaveBool() {
    this.save = this.ProductosPost.length > 0;
  }

  private CalcularValores() {
    this.RootFactPost.Subtotal = 0;
    for (const item of this.ProductosPost) {
      if (item.Subtotal) {
        this.RootFactPost.Subtotal += item.Subtotal;
      }
    }
    this.RootFactPost.IVA = this.RootFactPost.Subtotal * 0.12;
    this.RootFactPost.Total =
      this.RootFactPost.Subtotal + this.RootFactPost.IVA;
  }
}
