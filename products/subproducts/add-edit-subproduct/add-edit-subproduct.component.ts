import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SubproductsService } from '../subproducts.service';
import { Subproducts } from '../subproducts';
import { AddEditProductComponent} from '../../add-edit-product/add-edit-product.component';

@Component({
  selector: 'app-add-edit-subproduct',
  templateUrl: './add-edit-subproduct.component.html',
  styleUrls: ['./add-edit-subproduct.component.scss'],
})
export class AddEditSubproductComponent implements OnInit {

  pageTitle: string;
  error: string;
  uploadError: string;

  subproductForm: FormGroup;
  addeditsubproduct: Subproducts;

  subposts: Subproducts[] = [];
  id;

  constructor(private pf: FormBuilder,
              private spservice: SubproductsService,
              private router: Router,
              private route: ActivatedRoute) {
    this.createForm();
  }

  createForm() {
    this.subproductForm = this.pf.group({
      name: '',
      color: '',
      quantity: '',
      price: '',
      description: ''
    });
  }
  image: File;
  name: string;
  code: number;
  quantity: number;
  price: number;
  desctription: string;
  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.pageTitle = 'Edit Subproduct';
      this.spservice.getSubproduct(this.id).subscribe(
        (res: any) => {
          this.subproductForm.patchValue({
            image: res.image,
            name: res.name,
            code: res.color,
            quantity: res.quantity,
            price: res.price,
            description: res.description
          });
        }
      );
    } else {
      this.pageTitle = 'Add SubProduct';
    }
  }



  updateSubproduct() {
      this.addeditsubproduct = this.subproductForm.value;
      console.table(this.addeditsubproduct);
      this.subproductForm.reset();
      this.spservice.updateSubproduct(this.addeditsubproduct, this.id)
      .subscribe(
        (data) => {this.subposts.push(data); }
        // success => alert("Done"),
        // error => alert("error")
      );
  }

  onSubmit() {
    if (this.id) {
      this.updateSubproduct();
      this.router.navigateByUrl('addeditproduct/:id');
    } else {
    this.addeditsubproduct = this.subproductForm.value;
    console.table(this.addeditsubproduct);
    this.subproductForm.reset();

    this.spservice.createSubproduct(this.addeditsubproduct).subscribe(
      data => this.subposts.push(data)
    );
    this.router.navigateByUrl('/addeditproduct/:id');
  }
  }

}
