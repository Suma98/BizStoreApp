import { Component, OnInit } from '@angular/core';
import { ExpenseService } from '../expense.service';
import { Expense } from '../../model/expense';
import { headersToString } from 'selenium-webdriver/http';
import { AlertController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { ImageViewerComponent } from '../../image-viewer/image-viewer.component';
import { ToastController } from '@ionic/angular';
import { Observable, Observer } from 'rxjs';
import { Authkey } from '../../model/authkey'

@Component({
  selector: 'app-view-expense',
  templateUrl: './view-expense.component.html',
  styleUrls: ['./view-expense.component.scss'],
})
export class ViewExpenseComponent implements OnInit {

  height: number = 10;
  width: number = 10;
 
  expense: Expense[];
  cash: boolean=false;
  cheque: boolean= false;
  partial:boolean= false; 
  imageurl: string=Authkey.getimageurl()
  styleimage(){
    return {width: this.width, height: this.height}
  }

  constructor(private expservice: ExpenseService, 
    public alertController: AlertController, 
    public modalController: ModalController, 
    public toastController: ToastController) { }

    ngOnInit() {
      this.expservice.refreshNeeded$
      .subscribe(() => {
        this.getexpense();
      });
      this.getexpense();
    }
  
    private getexpense(){
      this.expservice.getexpense().subscribe((data: any)=>{
        this.expense= data;
        console.table(this.expense);
      }); 
    }
  
    async deletealert(expense: Expense) {
      const alert = await this.alertController.create({
        header: 'Confirm!',
        message: 'Are you sure you want to delete this expense?',
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
              this.deleteexpense(expense);
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
  
    deleteexpense(expense: Expense){
  
      this.expservice.deleteData(expense).subscribe((data: Expense) => {
        console.log(data);
        this.presentToast();
  
        this.expservice.getexpense().subscribe((data: Expense[]) => {
          this.expense = data;
          console.log(data);
        });
      });
    }
}
  
    
  


    