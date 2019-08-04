import { Component, OnInit } from '@angular/core';
import { SubproductsService } from './subproducts.service';
import { Subproducts } from './subproducts';


@Component({
  selector: 'app-subproducts',
  templateUrl: './subproducts.component.html',
  styleUrls: ['./subproducts.component.scss'],
})
export class SubproductsComponent implements OnInit {

  constructor() { }

  ngOnInit() {}

}
