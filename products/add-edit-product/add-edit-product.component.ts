import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductsService } from '../products.service';
import { Products } from '../products';
import {Subproducts} from '../subproducts';
import { FileUploader } from 'ng2-file-upload';
import { ImageUploaderOptions, FileQueueObject } from 'ngx-image-uploader';
import {Authkey} from '../../model/authkey';
import { AlertController } from '@ionic/angular';
import { HttpParams } from '@angular/common/http';

class ImageSnippet {
  constructor(public src: string, public file: File) {}
}

@Component({ 
  selector: 'app-add-edit-product', 
  templateUrl: './add-edit-product.component.html',
  styleUrls: ['./add-edit-product.component.scss'],
})
export class AddEditProductComponent implements OnInit {
  imageurl = Authkey.getimageurl();
  private buttonColor: string = "#ff7777";
 
  pageTitle: string;
  error: string;
  uploadError: string;
  subproductdisable: boolean = false;
  productForm: FormGroup;
  addeditproduct: Products;

  posts: Products[] = [];
  id: string;
  data: Products[] = [];

  constructor(private pf: FormBuilder,
              private pservice: ProductsService,
              public router: Router,
              private route: ActivatedRoute,
              public alertController: AlertController) {
    this.createForm(); 
  }
  createForm() {
    this.productForm = this.pf.group({
      image: File ,
      name: '',
      code: '',
      quantity: '',
      price: '',
      description: ''
    });
  }


  imageURL: string;
  image: string;
  selectedFile: ImageSnippet ;
  


  processFile(imageInput: any) {
    const file: File = imageInput.files[0];
    this.productForm.controls['image'].setValue(file);
    const reader = new FileReader();

    reader.addEventListener('load', (event: any) => {

      this.selectedFile = new ImageSnippet(event.target.result, file);
      this.pservice.uploadImage(this.selectedFile.file).subscribe(
        (res: any) => {
        // console.log(res);
        this.image= res.file;
        console.log(res.file);
        },
        (err) => {
        
        })
    });
    reader.readAsDataURL(file); 
  }

  
  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.pageTitle = 'Edit Product';
      this.pservice.getProduct(this.id).subscribe(
        (res: any)=> {
          this.productForm.patchValue({
            
            name: res.name,
            code: res.code,
            quantity: res.quantity,
            price: res.price,
            description: res.description
          }); 
          this.image=res.image;
        }
      );
    } else {
      this.pageTitle = 'Add Product';
    }
  }

  updateProduct() {
      this.addeditproduct = this.productForm.value;
      console.table(this.addeditproduct);
      this.productForm.reset();
      this.pservice.updateProduct(this.addeditproduct, this.id)
      .subscribe(
        (data) => {this.posts.push(data);
         }
        // success => alert("Done"),
        // error => alert("error")
      );
  }

  
  onSubmit() {
    if (this.id) {
      this.productForm.value.image = this.image; 
      this.updateProduct();
      this.router.navigate(['/viewproduct', this.id]);
    } else {
    this.productForm.value.image = this.image;  
    this.addeditproduct = this.productForm.value;
    console.table(this.addeditproduct);
    this.productForm.reset();
    this.pservice.createProduct(this.addeditproduct).subscribe(
      data => this.posts.push(data)
    );
    this.router.navigateByUrl('/product');
  }
  }


  onCancel() {
    if (this.id) {
    this.router.navigate(['/viewproduct', this.id]);
    } else {
      this.router.navigate(['/product']);
    }
  }

  async addsubprod() {
    const alert = await this.alertController.create({
      header: 'Add Subproduct',
      inputs: [
        {
          name: 'color',
          type: 'text',
          placeholder: 'color'
        },
        {
          name: 'price',
          type: 'number',
          placeholder: 'price'
        },
        {
          name: 'Quantity',
          type: 'number',
          placeholder: 'quantity'
        },
        
        {
          name: 'Description',
          type: 'text',
          placeholder: 'Description' 
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: data => {

            console.log('Confirm Ok');
            console.log(data.color);
            // console.log(data.price);
            this.subproductdisable= true;
            this.addsubproduct(data);
          }
        }
      ]
    });

    await alert.present();
  }
  
  subproductarray: Subproducts[]=[]
  addsubproduct(data: Subproducts[]=[]){
    this.subproductarray = data;
  }

}

