import { Component, OnInit } from "@angular/core";
import { UserRequest } from "app/Models/InterfacesUsuario";
import { UsuariosService } from "app/Services/usuarios.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-mi-perfil",
  templateUrl: "./mi-perfil.component.html",
  styleUrls: ["./mi-perfil.component.scss"],
})
export class MiPerfilComponent implements OnInit {
  constructor(
    private userService: UsuariosService,
    private toastr: ToastrService
  ) {}

  listaFrases = [
    "El único modo de hacer un gran trabajo es amar lo que haces - Steve Jobs",
    "El dinero no es la clave del éxito; la libertad para poder crear lo es - Nelson Mandela",
    "Cuanto más duramente trabajo, más suerte tengo - Gary Player",
    "La inteligencia consiste no sólo en el conocimiento, sino también en la destreza de aplicar los conocimientos en la práctica - Aristóteles",
    "El trabajo duro hace que desaparezcan las arrugas de la mente y el espíritu - Helena Rubinstein ",
    "Cuando algo es lo suficientemente importante, lo haces incluso si las probabilidades de que salga bien no te acompañan - Elon Musk",
    "Escoge un trabajo que te guste, y nunca tendrás que trabajar ni un solo día de tu vida - Confucio",
    "A veces la adversidad es lo que necesitas encarar para ser exitoso - Zig Ziglar",
    "La lógica te llevará de la a a la z. la imaginación te llevará a cualquier lugar - Albert Einstein",
    "Para tener éxito tu deseo de alcanzarlo debe ser mayor que tu miedo al fracaso - Bill Cosby",
  ];

  frase: string = "";
  usuario: UserRequest = {
    id: 0,
    cedula: "",
    username: "",
    password: "",
    nombres: "",
    estado: 1,
  };

  user: any;
  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem("miperfil"));
    console.log(this.user);
    this.usuario.id = this.user.id;
    this.usuario.username = this.user.userName;
    this.usuario.nombres = this.user.Nombres;
    this.usuario.cedula = this.user.Cedula;
    this.usuario.rol = this.user.RollName;

    let num = Math.floor(Math.random() * (9 - 0));
    this.frase = this.listaFrases[num];
    console.log(this.usuario);
  }

  editarPerfil() {
    // if (!this.validarUsuario()) {
    //   return;
    // }
    this.userService.putUsuarios(this.usuario).subscribe(
      (data) => {
        if (data.status == 200) {
          this.showNotification("top", "center", 2, data.msg);
          console.log(this.usuario);

          this.user.id = this.usuario.id;
          this.user.userName = this.usuario.username;
          this.user.Nombres = this.usuario.nombres;
          this.user.Cedula = this.usuario.cedula;
          this.user.RollName = this.usuario.rol;
          localStorage.setItem("miperfil", JSON.stringify(this.user));
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
          let er = err["error"];
          this.showNotification("top", "center", 4, er.msg);
        }
      }
    );
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
    if (this.usuario.password.length < 6) {
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

    if (!regex.test(this.usuario.password)) {
      this.showNotification(
        "top",
        "center",
        3,
        "La Contraseña no cumple los requisitos, una letra minuscula, mayuscula, numeros, caracteres especiales y minumo 8"
      );
      return false;
    }
    if (this.usuario.username.length < 4) {
      this.showNotification("top", "center", 3, "Debe ingresar un usuario");
      return false;
    }
    return true;
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
}
