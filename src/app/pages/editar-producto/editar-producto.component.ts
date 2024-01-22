import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Root } from "app/Models/InterfacesProducts";
import { Producto } from "app/Models/producto";
import { CodigoBarrasService } from "app/Services/codigo.service";
import { ProductoService } from "app/Services/producto2.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-editar-producto",
  templateUrl: "./editar-producto.component.html",
  styleUrls: ["./editar-producto.component.scss"],
})
export class EditarProductoComponent implements OnInit {
  productoForm: FormGroup;
  titulo = "Editar producto";
  id: string | null;
  codigoBarras: string = "";
  producto: Root = { }; // Inicializa la propiedad producto
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private _productoService: ProductoService,
    private codigoBarrasService: CodigoBarrasService,
    private aRouter: ActivatedRoute
  ) {
    this.productoForm = this.fb.group({
      nombre: [{ value: "", disabled: true }, Validators.required],
      codigo: [{ value: "", disabled: true }, Validators.required],
      peso: ["", Validators.required],
      precio: ["", Validators.required],
    });
    this.id = this.aRouter.snapshot.paramMap.get("id");
    
  }

  ngOnInit(): void {
    this.obtenerProducto()
  }

  obtenerProducto() {
    if (this.id !== null) {
      this._productoService.obtenerProducto(this.id).subscribe(data => {
        

        this.producto = data;
        console.log('rrrrrr',  this.producto)

        this.productoForm.patchValue({
          nombre: data.Nombre,
          codigo: data.Codigo,
          peso: data.Peso,
          precio: data.Precio,
        });
      });
    }
  }

  // esEditar() {
  //   if (this.id !== null) {
  //     this.titulo = "Ingresar peso del producto";
  //     this._productoService.obtenerProducto(this.id).subscribe((data) => {
  //       this.productoForm.setValue({
  //         producto: data.nombre,
  //         codigo: data.codigo,
  //         peso: data.peso,
  //         precio: data.precio,
  //       });
  //     });
  //     //this.habilitarEdicion();
  //   }
  // }
  calcularCodigoBarras() {

    let codigo = this.productoForm.get("codigo")?.value;
    codigo = codigo.toString();
    console.log(codigo, codigo.length)

    if(codigo.length < 4){

      const i = 4 - codigo.length
      
      let prefix = "";
      for (let index = 0; index < i; index++) {
        prefix += "0"
      }
      codigo = prefix + codigo;
    }

    console.log("CODIGO FIX", codigo)

    this.codigoBarras = this.codigoBarrasService.calcularCodigoBarras(
      codigo,
      this.productoForm.get("peso")?.value,
      this.productoForm.get("precio")?.value
    );
  }
}
