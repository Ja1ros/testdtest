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
import * as JsBarcode from 'jsbarcode';
import { ChangeDetectorRef } from '@angular/core';


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
  codigoBarrasImageUrl: string = "";
  producto: Root = { };

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private _productoService: ProductoService,
    private codigoBarrasService: CodigoBarrasService,
    private aRouter: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {
    this.productoForm = this.fb.group({
      nombre: [{ value: "", disabled: true }, Validators.required],
      codigo: [{ value: "", disabled: true }, Validators.required],
      peso: ["", Validators.required],
      precio: ["", Validators.required],
      codigoBarras: ["", Validators.required],
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
        //console.log('rrrrrr',  this.producto)
        this.productoForm.patchValue({
          nombre: data.Nombre,
          codigo: data.Codigo,
          peso: data.Peso,
          precio: data.Precio,
        });
      });
    }
  }

  calcularCodigoBarras() {
    let codigo = this.productoForm.get("codigo")?.value;
    codigo = codigo.toString();
    //console.log(codigo, codigo.length)
    if(codigo.length < 4){
      const i = 4 - codigo.length
      let prefix = "";
      for (let index = 0; index < i; index++) {
        prefix += "0"
      }
      codigo = prefix + codigo;
    }

     const peso = this.productoForm.get("peso")?.value;
     const precio = this.productoForm.get("precio")?.value;
    // const precioTotal = peso * precio;
    // console.log(peso)
    // console.log(precio)
    // console.log("precioTotal: "+precioTotal)
    // this.productoForm.patchValue({
    //   precioTotal: precioTotal
    // });

    this.cdr.detectChanges();
    this.codigoBarras = this.codigoBarrasService.calcularCodigoBarras(
      codigo, peso, precio);

    JsBarcode("#barcode", this.codigoBarras);
    this.productoForm.patchValue({
      codigoBarras: this.codigoBarras,
    });
    //console.log("Precio total calculado:", precioTotal);
    //console.log("Código de barras generado:", this.codigoBarras);
  }
}
