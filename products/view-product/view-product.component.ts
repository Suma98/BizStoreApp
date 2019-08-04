import { Component, OnInit } from '@angular/core';
import { Params, Router, ActivatedRoute} from '@angular/router';
import { ProductsService } from '../products.service';
import { Products } from '../products';
import { HttpParams } from '@angular/common/http';
import {Authkey} from '../../model/authkey';
@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrls: ['./view-product.component.scss'],
})
export class ViewProductComponent implements OnInit {

  viewproduct: Products[] = [];

  height: number = 10;
  width: number = 10;
 
  imageurl: string=Authkey.getimageurl()
  styleimage(){
    return {width: this.width, height: this.height}
  }
  
  id;
  // imageurl:string =Authkey.getimageurl();
  constructor(private pservice: ProductsService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.pservice.refreshNeeded$
     .subscribe(() => {
       this.getProduct(this.id);
     });
    this.getProduct(this.id);

      // this.id = this.route.snapshot.paramMap.get('id');
      // if (this.id) {
      //   this.pservice.getProduct(this.id).subscribe((data: Products[]) => {
      //     this.viewproduct = data;
      //   });
      // } else {
      //   console.log('No details found');
      // }
}

   private getProduct(id: string) {
      
      this.pservice.getProduct(this.id).subscribe((data: Products[] )=> {
        
        this.viewproduct = data;
        console.table(data);
        });
      }
}
