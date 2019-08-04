import { Component, OnInit } from '@angular/core';
import { ProductsService } from './products.service';
import { Products } from './products';
import { headersToString } from 'selenium-webdriver/http';
import { AlertController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { ImageViewerComponent } from '../image-viewer/image-viewer.component';
import { ToastController } from '@ionic/angular';
import { Observable, Observer } from 'rxjs';
import {Authkey} from '../model/authkey';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  height: number = 10;
  width: number = 10;
 
  products: Products[];
  imageurl: string=Authkey.getimageurl()
  styleimage(){
    return {width: this.width, height: this.height}
  }


 constructor (private pservice: ProductsService, 
              public alertController: AlertController, 
              public modalController: ModalController, 
              public toastController: ToastController) {}

  ngOnInit() {

    this.pservice.refreshNeeded$
    .subscribe(() => {
      this.getProducts();
    });
    this.getProducts();
  }

  private getProducts() {
    this.pservice.getProducts().subscribe((data: Products[]) => {
      this.products = data;
    });
  }

  async deletealert(product: Products) {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: 'Are you sure you want to delete this product?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Yes',
          handler: () => {
            console.log('Confirm Okay');
            this.deleteproduct(product);
          }
        }
      ]
    });

    await alert.present();
  }
  
  async viewImage(src: string) {
    const modal = await this.modalController.create({
      component: ImageViewerComponent,
      componentProps: {
        imgSource: src,

      },
      cssClass: 'modal-fullscreen',
      keyboardClose: true,
      showBackdrop: true
    });

    return await modal.present();
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'successfully deleted',
      duration: 3000
    });
    toast.present();
  }

  deleteproduct(product: Products){

    this.pservice.deleteData(product).subscribe((data: Products) => {
     // this.products = data;
      console.log(data);
      this.presentToast();

      this.pservice.getProducts().subscribe((data: Products[]) => {
        this.products = data;
        console.log(data);
      });
    });
  }
}
