import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Detalle, FacturaDesc, RootFacturaDesc } from 'app/Models/InterfaceFactura';
import { FacturaService } from '../../Services/factura.service';

@Component({
  selector: 'app-ver-factura',
  templateUrl: './ver-factura.component.html',
  styleUrls: ['./ver-factura.component.scss']
})
export class VerFacturaComponent implements OnInit {

  constructor( private route: ActivatedRoute,
    private facturaService: FacturaService) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.GetFacturaDetalle(Number(id));
  }

  facturaDesc: FacturaDesc = {
    ID: 0,
    CedRuc: '0999999999',
    Telefono: '0999999999',
    Cliente: 'Cliente',
    Direccion: 'Ambato',
    Fecha: '',
    IVA: 0.0,
    Subtotal: 0.0,
    Total: 0.0,
  };

  detalles: Detalle[] = [];

  GetFacturaDetalle(id: number) {
    this.facturaService
      .GetFacturaDetalle(id)
      .subscribe((response: RootFacturaDesc) => {
        this.facturaDesc = response.Factura;
        this.detalles = response.Detalle;
        console.log('Factura Detalle', response);
      });
  }

}
