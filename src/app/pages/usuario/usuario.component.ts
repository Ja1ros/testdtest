import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { UsuariosService } from "app/Services/usuarios.service";
import {
  ResponseUser,
  UserRequest,
} from "../../Models/InterfacesUsuario";
import { DataTableDirective } from "angular-datatables";
import { Subject } from "rxjs";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-usuario",
  templateUrl: "./usuario.component.html",
  styleUrls: ["./usuario.component.scss"],
})
export class UsuarioComponent implements OnInit {
  constructor(
    private userService: UsuariosService,
    private toastr: ToastrService
  ) {}

  usuarios: ResponseUser[] = [];

  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptionsU: DataTables.Settings = {};
  dtTriggerU: Subject<any> = new Subject<any>();
  dtOptions: DataTables.Settings = {};
  rol: string = "";
  usuario: UserRequest = {
    id: 0,
    cedula: "",
    username: "",
    password: "",
    nombres: "",
    estado: 1,
  };

  ngOnInit(): void {
    this.rol = JSON.parse(localStorage.getItem("rol"));

    this.dtOptionsU = {
      ajax: (dataTablesParameters: any, callback) => {
        this.userService.getUsuarios().subscribe((data) => {
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
          data: "Cedula",
        },
        {
          title: "Nombres",
          data: "Nombres",
        },

        {
          title: "Usuario",
          data: "UserName",
        },
        {
          title: "Password",
          data: "UserPassword",
          render: function (data) {
            return data.substring(0, 10) + "...";
          },
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
          id="EditarUsuario"
          type="button"
          class="btn btn-info btn-sm"
          data-toggle="modal"
          data-target="#exampleModal"
        >
          <i class="nc-icon nc-tag-content"></i>
        </button>

        <button
          id="btnEliminarUsuario" 
          class="btn btn-danger btn-sm"
        >
          <i class="nc-icon nc-simple-remove"></i>
        </button>`;
          },
        },
      ],
    };
  }

  ngAfterViewInit(): void {
    var _thisDoc = this;
    $("#usuario-table").on("click", "#EditarUsuario", function (data) {
      let datas = $("#usuario-table")
        .DataTable()
        .row($(this).parents("tr"))
        .data() as ResponseUser;

      _thisDoc.Editar(datas);
    });

    $("#usuario-table").on("click", "#btnEliminarUsuario", function (data) {
      let datas = $("#usuario-table")
        .DataTable()
        .row($(this).parents("tr"))
        .data() as ResponseUser;

      _thisDoc.EliminarUsuario(datas);
    });
  }

  async reload() {
    let dt = await this.dtElement.dtInstance;
    dt.ajax.reload();
    
  }

  EditarUsuario() {}

  getUsuario() {
    this.dtOptions = {
      pagingType: "full_numbers",
      ordering: false,
      language: {
        url: "https://cdn.datatables.net/plug-ins/1.13.1/i18n/es-ES.json",
      },
      destroy: true,
    };

    this.userService.getUsuarios().subscribe((resp) => {
      this.usuarios = resp.data;
      this.dtTriggerU.next(this.usuarios);
    });
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

  validarUsuario() {
    if (this.usuario.cedula.length < 10) {
      this.showNotification(
        "top",
        "center",
        3,
        "La Cédula debe tener 10 dígitos"
      );
      return false;
    }
    if (!this.validarCed(this.usuario.cedula.trim())) {
      this.showNotification("top", "center", 3, "La Cédula no es válida");
      return false;
    }
    if (this.usuario.nombres.length < 3) {
      this.showNotification(
        "top",
        "center",
        3,
        "El nombre debe más de 3 dígitos"
      );
      return false;
    }

    if (this.usuario.username.length < 4) {
      this.showNotification("top", "center", 3, "Debe ingresar un usuario");
      return false;
    }
    return true;
  }

  @ViewChild("closeModalUsuario") closeModalUsuario: ElementRef;

  GuardarUsuario() {
    if (this.usuario.id == 0) {
      if (!this.validarUsuario()) {
        return;
      }
      this.userService.postUsuarios(this.usuario).subscribe(
        async (data) => {
          this.showNotification("top", "center", 2, data.msg);
          await this.reload();

          this.usuario = {
            id: 0,
            cedula: "",
            username: "",
            password: "",
            nombres: "",
            estado: 1,
          };
          this.closeModalUsuario.nativeElement.click(); //<-- here
        },
        (err) => {
          console.log(err);
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
            let er = err["error"];
            this.showNotification("top", "center", 4, er.msg);
          }
        }
      );
    } else {
      this.userService.putUsuarios(this.usuario).subscribe(
        async (data) => {
          this.showNotification("top", "center", 2, data.msg);
          await this.reload();

          this.usuario = {
            id: 0,
            cedula: "",
            username: "",
            password: "",
            nombres: "",
            estado: 1,
          };
          this.closeModalUsuario.nativeElement.click(); //<-- here
        },
        (err) => {
          console.log(err);
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
            let er = err["error"];
            this.showNotification("top", "center", 4, er.msg);
          }
        }
      );
    }
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

  Editar(usuario: ResponseUser) {
    this.usuario.id = usuario.ID;
    this.usuario.username = usuario.UserName;
    this.usuario.cedula = usuario.Cedula;
    this.usuario.nombres = usuario.Nombres;
    this.usuario.estado = 1;
  }

  EliminarUsuario(usuario: ResponseUser) {
    this.usuario.id = usuario.ID;
    this.usuario.nombres = usuario.Nombres;
    this.usuario.username = usuario.UserName;
    this.usuario.cedula = usuario.Cedula;
    this.usuario.estado = 0;
    this.userService.putUsuarios(this.usuario).subscribe(
      async (data) => {
        this.showNotification("top", "center", 2, data.msg);
        await this.reload();

        this.usuario = {
          id: 0,
          cedula: "",
          username: "",
          password: "",
          nombres: "",
          estado: 1,
        };
        this.closeModalUsuario.nativeElement.click(); //<-- here
      },
      (err) => {
        console.log(err);
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
          let er = err["error"];
          this.showNotification("top", "center", 4, er.msg);
        }
      }
    );
  }
}
