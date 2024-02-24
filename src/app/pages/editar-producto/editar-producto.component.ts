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
  //codigoBarras: any;
  codigoBarrasImageUrl: string = "";
  producto: Root = { }; // Inicializa la propiedad producto

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
    const precioTotal = peso * precio;

    this.productoForm.patchValue({
      precioTotal: precioTotal
    });

    // Realiza la detección de cambios manualmente
    this.cdr.detectChanges();

   // console.log("CODIGO FIX", codigo)

    // this.codigoBarras = this.codigoBarrasService.calcularCodigoBarras(
    //   codigo,
    //   this.productoForm.get("peso")?.value,
    //   this.productoForm.get("precio")?.value,
    // );    

    this.codigoBarras = this.codigoBarrasService.calcularCodigoBarras(
      codigo,
      peso,
      precioTotal, // Usa el precioTotal en lugar de precio
    ); 
    // Genera el código de barras usando JsBarcode
    JsBarcode("#barcode", this.codigoBarras);

    // Actualiza el valor del código de barras en el formulario
    this.productoForm.patchValue({
      codigoBarras: this.codigoBarras,
      precioTotal: precioTotal
    });
    console.log("Precio total calculado:", precioTotal);
    //console.log("Código de barras generado:", this.codigoBarras);
  }
}
