import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { ClienteService } from "../../Services/cliente.service";
import { ToastrService } from "ngx-toastr";
import {
  IRespCliente,
  ICliente,
  ClienteRequest,
} from "../../Models/InterfacesClients";
import { Subject } from "rxjs";
import { DataTableDirective } from "angular-datatables";
import { IResp } from "app/Models/Interfaces";

@Component({
  selector: "app-cliente",
  templateUrl: "./cliente.component.html",
  styleUrls: ["./cliente.component.scss"],
})
export class ClienteComponent implements OnInit {
  constructor(
    private clienteService: ClienteService,
    private toastr: ToastrService
  ) {}

  @ViewChild(DataTableDirective, { static: false })
  
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  clientes: ICliente[] = [];
  rol: string = "";
  cliente: ClienteRequest = {
    id: 0,
    cedula: "",
    nombres: "",
    apellidos: "",
    telefono: "",
    direccion: "",
    estado: 1,
    email: "",
    pass: "",
  };

  @ViewChild("closeModal") closeModal: ElementRef;
  @ViewChild("closeEditar") closeModalEditar: ElementRef;
  @ViewChild("Editar") editar: ElementRef;

  async reload() {
    let dtIntance =await this.dtElement.dtInstance;
    dtIntance.ajax.reload();
  } 

  async ngOnInit() {
    this.rol = JSON.parse(localStorage.getItem("rol"));

    this.dtOptions = {
      ajax: (dataTablesParameters: any, callback) => {
        this.clienteService.getClientes().subscribe((data: IRespCliente) => {
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
        {
          title: "Email",
          data: "Correo",
        },
      ],
      columnDefs: [
        {
          targets: 7,
          title: "Estado",
          data: "Estado",
          render: function (data, type, row) {
            return data == 1
              ? `<span class="badge bg-info">Activo</span>`
              : `<span class="badge bg-danger">Inactivo</span>`;
          },
        },
        {
          targets: 8,
          title: "Opciones",
          data: null,
          render: function (data, type, row) {
            return `<button
            #Editar
          id="Editar"
          type="button"
          class="btn btn-info btn-sm"
          data-toggle="modal"
          data-target="#exampleModalEditar"
        >
          <i class="nc-icon nc-tag-content"></i>
        </button>

        <button
          id="btnEliminar" 
          class="btn btn-danger btn-sm"
        >
          <i class="nc-icon nc-simple-remove"></i>
        </button>`;
          },
        },
      ],
    };

    // this.dtOptions = {
    //   pagingType: "full_numbers",
    //   ordering: false,
    //   language: {
    //     url: "https://cdn.datatables.net/plug-ins/1.13.1/i18n/es-ES.json",
    //   },
    //   destroy: true,
    // };
    // await this.GetInitData();
  }

  GetInitData = async () => {
    try {
      await this.getClientes();
    } catch (error) {
      throw error;
    }
  };
  ngAfterViewInit(): void {
    this.dtTrigger.next(true);

    var _thisDoc = this;
    $("#client-table").on("click", "#Editar", function (data) {
      let datas = $("#client-table")
        .DataTable()
        .row($(this).parents("tr"))
        .data() as ICliente;

      _thisDoc.EditarCliente(datas);
    });

    $("#client-table").on("click", "#btnEliminar", function (data) {
      let datas = $("#client-table")
        .DataTable()
        .row($(this).parents("tr"))
        .data() as ICliente;

      _thisDoc.EliminarCliente(datas);
    });
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  showNotification(from, align, color, message) {
    switch (color) {
      case 1:
        this.toastr.info(
          `<span data-notify="icon" class="nc-icon nc-bell-55"></span><span data-notify="message"> ${message}</span>`,
          "",
          {
            timeOut: 4000,
            closeButton: true,
            enableHtml: true,
            toastClass: "alert alert-info alert-with-icon",
            positionClass: "toast-" + from + "-" + align,
          }
        );
        break;
      case 2:
        this.toastr.success(
          `<span data-notify="icon" class="nc-icon nc-bell-55"></span><span data-notify="message">${message}</span>`,
          "",
          {
            timeOut: 4000,
            closeButton: true,
            enableHtml: true,
            toastClass: "alert alert-success alert-with-icon",
            positionClass: "toast-" + from + "-" + align,
          }
        );
        break;
      case 3:
        this.toastr.warning(
          `<span data-notify="icon" class="nc-icon nc-bell-55"></span><span data-notify="message"> ${message}</span>`,
          "",
          {
            timeOut: 4000,
            closeButton: true,
            enableHtml: true,
            toastClass: "alert alert-warning alert-with-icon",
            positionClass: "toast-" + from + "-" + align,
          }
        );
        break;
      case 4:
        this.toastr.error(
          `<span data-notify="icon" class="nc-icon nc-bell-55"></span><span data-notify="message"> ${message}</span>`,
          "",
          {
            timeOut: 4000,
            enableHtml: true,
            closeButton: true,
            toastClass: "alert alert-danger alert-with-icon",
            positionClass: "toast-" + from + "-" + align,
          }
        );
        break;
      case 5:
        this.toastr.show(
          `<span data-notify="icon" class="nc-icon nc-bell-55"></span><span data-notify="message"> ${message}</span>`,
          "",
          {
            timeOut: 4000,
            closeButton: true,
            enableHtml: true,
            toastClass: "alert alert-primary alert-with-icon",
            positionClass: "toast-" + from + "-" + align,
          }
        );
        break;
      default:
        break;
    }
  }

  getClientes = () => {
    return new Promise(async (resolve, reject) => {
      try {
        this.clienteService.getClientes().subscribe(
          (data: IRespCliente) => {
            this.clientes = data.data;

            this.dtTrigger.next(this.clientes);
            resolve(this.clientes);
          },
          (err) => {
            if (err["error"].errors != undefined) {
              let msg = "";
              let cant = err["error"].errors.length;
              for (let index = 0; index < cant; index++) {
                const element = err["error"].errors[index];
                if (index + 1 == cant) {
                  msg += element.msg;
                } else {
                  msg += element.msg + ", ";
                }
              }

              this.showNotification("top", "center", 4, msg);
              reject(msg);
            } else {
              let er: IRespCliente = err["error"];
              this.showNotification("top", "center", 4, er.msg);
              reject(er.msg);
            }
          }
        );
      } catch (error) {}
    });
  };

  EditarCliente(cliente: ICliente) {
    this.cliente.id = cliente.ID;
    this.cliente.cedula = cliente.CedRuc;
    this.cliente.nombres = cliente.Nombres;
    this.cliente.apellidos = cliente.Apellidos;
    this.cliente.telefono = cliente.Telefono;
    this.cliente.direccion = cliente.Direccion;
    this.cliente.email = cliente.Correo;
  }

  validarCliente() {
    if (this.cliente.cedula.length < 10) {
      this.showNotification(
        "top",
        "center",
        3,
        "La Cédula debe tener 10 dígitos"
      );
      return false;
    }
    if (!this.validarCed(this.cliente.cedula.trim())) {
      this.showNotification("top", "center", 3, "La Cédula no es válida");
      return false;
    }
    if (this.cliente.nombres.length < 3) {
      this.showNotification(
        "top",
        "center",
        3,
        "El nombre debe más de 3 dígitos"
      );
      return false;
    }
    if (this.cliente.apellidos.length < 3) {
      this.showNotification(
        "top",
        "center",
        3,
        "El apellido debe más de 3 dígitos"
      );
      return false;
    }

    if (this.cliente.pass.length < 6) {
      this.showNotification(
        "top",
        "center",
        3,
        "La Contraseña debe más de 6 dígitos"
      );
      return false;
    }

    let regex =
      /^(?!.*\s)(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹]).{8,16}$/;

    if (!regex.test(this.cliente.pass)) {
      this.showNotification(
        "top",
        "center",
        3,
        "La Contraseña no cumple los requisitos, una letra minuscula, mayuscula, numeros, caracteres especiales y minumo 8"
      );
      return false;
    }
    if (this.cliente.email.length < 5) {
      this.showNotification("top", "center", 3, "El Correo se debe ingresar");
      return false;
    }

    if (this.cliente.telefono.length < 10) {
      this.showNotification("top", "center", 3, "El teléfono se debe ingresar");
      return false;
    }
    if (this.cliente.direccion.length < 10) {
      this.showNotification(
        "top",
        "center",
        3,
        "La Direccion se debe ingresar"
      );
      return false;
    }

    return true;
  }

  validarClienteEditar() {
    if (this.cliente.cedula.length < 10) {
      this.showNotification(
        "top",
        "center",
        3,
        "La Cédula debe tener 10 dígitos"
      );
      return false;
    }

    if (!this.validarCed(this.cliente.cedula.trim())) {
      this.showNotification("top", "center", 3, "La Cédula no es válida");
      return false;
    }

    if (this.cliente.nombres.length < 3) {
      this.showNotification(
        "top",
        "center",
        3,
        "El nombre debe más de 3 dígitos"
      );
      return false;
    }
    if (this.cliente.apellidos.length < 3) {
      this.showNotification(
        "top",
        "center",
        3,
        "El apellido debe más de 3 dígitos"
      );
      return false;
    }

    if (this.cliente.email.length < 5) {
      this.showNotification("top", "center", 3, "El Correo se debe ingresar");
      return false;
    }

    if (this.cliente.telefono.length < 10) {
      this.showNotification(
        "top",
        "center",
        3,
        "El teléfono debe tener 10 dígitos"
      );
      return false;
    }
    if (this.cliente.direccion.length < 10) {
      this.showNotification(
        "top",
        "center",
        3,
        "La Direccion se debe ingresar"
      );
      return false;
    }

    return true;
  }

  GuardarCliente() {
    if (!this.validarCliente()) {
      return;
    }

    this.clienteService.postCliente(this.cliente).subscribe(
      async (data: IRespCliente) => {
        if (data.status == 200) {
          this.cliente = {
            id: 0,
            cedula: "",
            nombres: "",
            apellidos: "",
            telefono: "",
            direccion: "",
            estado: 1,
            email: "",
            pass: "",
          };
          //this.rerender();
          await this.reload();
          this.closeModal.nativeElement.click(); //<-- here
          this.showNotification("top", "center", 2, data.msg);
        }
      },
      (err) => {
        if (err["error"].errors != undefined) {
          let msg = "";
          let cant = err["error"].errors.length;
          for (let index = 0; index < cant; index++) {
            const element = err["error"].errors[index];
            if (index + 1 == cant) {
              msg += element.msg;
            } else {
              msg += element.msg + ", ";
            }
          }
          this.showNotification("top", "center", 4, msg);
        } else {
          let er: IResp = err["error"];
          this.showNotification("top", "center", 4, er.msg);
        }
      }
    );
  }

  EliminarCliente(cliente: ICliente) {
    this.cliente.id = cliente.ID;
    this.cliente.cedula = cliente.CedRuc;
    this.cliente.nombres = cliente.Nombres;
    this.cliente.apellidos = cliente.Apellidos;
    this.cliente.telefono = cliente.Telefono;
    this.cliente.direccion = cliente.Direccion;
    this.cliente.email = cliente.Correo;
    this.cliente.pass = cliente.Contra;
    this.cliente.estado = 0;
    this.clienteService.putCliente(this.cliente).subscribe(
      async (data: IRespCliente) => {
        if (data.status == 200) {
          this.cliente = {
            id: 0,
            cedula: "",
            nombres: "",
            apellidos: "",
            telefono: "",
            direccion: "",
            estado: 1,
            email: "",
            pass: "",
          };
          await this.reload();
          this.closeModal.nativeElement.click(); //<-- here
          this.showNotification("top", "center", 2, data.msg);
        }
      },
      (err) => {
        console.log(err) 
        if (err["error"].errors != undefined) {
          let msg = "";
          let cant = err["error"].errors.length;
          for (let index = 0; index < cant; index++) {
            const element = err["error"].errors[index];
            if (index + 1 == cant) {
              msg += element.msg;
            } else {
              msg += element.msg + ", ";
            }
          }
          this.showNotification("top", "center", 4, msg);
        } else {
          let er: IResp = err["error"];
          console.log(err["error"])
          this.showNotification("top", "center", 4, er.msg);
        }
      }
    );
  }

  Editar() {
    if (!this.validarClienteEditar()) {
      return;
    }
    this.cliente.estado = 1;
    this.clienteService.putCliente(this.cliente).subscribe(
      async (data: IRespCliente) => {
        if (data.status == 200) {
          this.showNotification("top", "center", 2, data.msg);
          this.cliente = {
            id: 0,
            cedula: "",
            nombres: "",
            apellidos: "",
            telefono: "",
            direccion: "",
            estado: 1,
            email: "",
            pass: "",
          };
         await this.reload();
          this.closeModalEditar.nativeElement.click(); //<-- here
        }
      },
      (err) => {
        if (err["error"].errors != undefined) {
          let msg = "";
          let cant = err["error"].errors.length;
          for (let index = 0; index < cant; index++) {
            const element = err["error"].errors[index];
            if (index + 1 == cant) {
              msg += element.msg;
            } else {
              msg += element.msg + ", ";
            }
          }
          this.showNotification("top", "center", 4, msg);
        } else {
          let er: IResp = err["error"];
          this.showNotification("top", "center", 4, er.msg);
        }
      }
    );
  }

  validarCed(ced) {
    var cad = ced;
    var total = 0;
    var longitud = cad.length;
    var longcheck = longitud - 1;

    if (cad !== "" && longitud === 10) {
      for (let i = 0; i < longcheck; i++) {
        if (i % 2 === 0) {
          var aux = cad.charAt(i) * 2;
          if (aux > 9) aux -= 9;
          total += aux;
        } else {
          total += parseInt(cad.charAt(i));
        }
      }
      total = total % 10 ? 10 - (total % 10) : 0;

      if (cad.charAt(longitud - 1) == total) {
        return true;
      } else {
        return false;
      }
    }
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.getClientes();
    });
  }
}
