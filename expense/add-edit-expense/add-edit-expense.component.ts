import { Component, OnInit } from '@angular/core';
import { FormBuilder,AbstractControl, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ExpenseService } from '../expense.service';
import { Expense } from '../../model/expense';
import {Authkey} from '../../model/authkey';
import { HttpParams } from '@angular/common/http';
import { FileUploader } from 'ng2-file-upload';
import { ImageUploaderOptions, FileQueueObject } from 'ngx-image-uploader'; 

class ImageSnippet {
  constructor(public src: string, public file: File) {} 
} 

@Component({ 
  selector: 'app-add-edit-expense',
  templateUrl: './add-edit-expense.component.html',
  styleUrls: ['./add-edit-expense.component.scss'],
}) 
export class AddEditExpenseComponent implements OnInit { 
  imageurl = Authkey.getimageurl();
  private buttonColor: string = "#ff7777";
  
 pageTitle: string;
 error: string;
  uploadError: string;
  expForm: FormGroup;
  addeditexpense: Expense;
  // date: AbstractControl;

  posts: Expense[] = [];
  id: string;
  data: Expense[] = [];

  showcash: boolean=false;
  showcheque: boolean= false;
  showpartial:boolean= false; 
  getToday(): string {
   return new Date().toISOString().split('T')[0];
}
   
  constructor(private expform: FormBuilder,
    private expservice: ExpenseService,
    public router: Router,
    private route: ActivatedRoute) 
    { 
      this.createForm(); 
    }
    createForm() {
      this.expForm = this.expform.group({
        image: File,
        title: '',
        date: '',
        type: '',
        amount: '',
        payment_mode: '',
        cheque: '',
        chequeAmount: '', 
        details: '',
        advance: ''
      });
    }

    imageURL: string;
    image: string;
    selectedFile: ImageSnippet ;
  
    processFile(imageInput: any) {
      const file: File = imageInput.files[0];
      this.expForm.controls['image'].setValue(file);
      const reader = new FileReader();
      reader.addEventListener('load', (event: any) => { 
        this.selectedFile = new ImageSnippet(event.target.result, file);
        this.expservice.uploadImage(this.selectedFile.file).subscribe(
          (res: any) => {
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
      this.pageTitle = 'Edit Expense';
      this.expservice.getexpenses(this.id).subscribe(
        (res: any)=> {
          this.expForm.patchValue({
            title: res.title,
            date:  res.date ,
            type:  res.type,
            amount: res.amount,
            payment_mode: res.payment_mode,
            details: res.details,
            cheque : res.cheque,
            advance : res.advance,
            chequeAmount : res.chequeAmount
            
          });
          // this.date= res.date; 
          
          this.image=res.image;
          this.onclick(res.payment_mode);
          console.log(res);
          
        }
      );
    } else {
      this.pageTitle = 'Add Expense';
  }
  }

  updateExpense() {
    this.addeditexpense = this.expForm.value;
    console.table(this.addeditexpense);
    this.expForm.reset();
    this.expservice.updateExpense(this.addeditexpense, this.id)
    .subscribe(
      (data) => {this.posts.push(data);
       }
    );
}

  onSubmit() {
    if (this.id) {
      this.expForm.value.image = this.image; 
      this.updateExpense();
      this.router.navigate(['/particularexpense', this.id]);
    } else {
    this.expForm.value.image = this.image;  
    this.addeditexpense = this.expForm.value;
    console.table(this.addeditexpense);
    // console.table(this.addeditexpense); 
    this.expForm.reset();
    this.expservice.createExpense(this.addeditexpense).subscribe(
      data => this.posts.push(data)
    );
    this.router.navigateByUrl('/viewexpense');
    }
  }
    onCancel() {
      if (this.id) {
        this.router.navigate(['/particularexpense', this.id]);
        } else {
        this.router.navigate(['/viewexpense']);
        }
    }  
  

 private onclick(event: any){
   console.log(event);
   var payment_mode = event;
   if(payment_mode=="0"){
    this.showcash= true;
    this.showpartial= false;
    this.showcheque= false;
   }

   if(payment_mode=="1"){
     this.showpartial= false;
     this.showcheque= true;
     this.showcash= false;
     
   }
   if(payment_mode=="2"){
     this.showcheque= false;
     this.showpartial=true;
     this.showcash= false;
   }
  }

  }
