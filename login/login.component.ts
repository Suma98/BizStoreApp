import { Component, OnInit } from '@angular/core';
import { LoginService } from './login.service';
import { Login } from './login';
import { ToastController, Platform, AlertController, NavController, NavParams,  MenuController } from '@ionic/angular';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { map, filter } from 'rxjs/operators';
// import { map } from 'rxjs/internal/operators/map';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})


export class LoginComponent implements OnInit {
 // account:any;
 posts;
 user;

login = new Login();

  showPostForm = false;
  error: string;
  validations_form: FormGroup;

 constructor( private platform: Platform,private navctrl: NavController, private menuctrl: MenuController, private lservice: LoginService, public alertCtrl: AlertController, private formBuilder: FormBuilder, private router: Router, public toastController: ToastController) {
  this.menuctrl.enable(false)
 }

//  trimValue(event) { event.target.value = event.target.value.trim(); }


 trimValue(formControl) { 
  formControl.setValue(formControl.value.trim());
}

ngOnInit() {
      this.validations_form = this.formBuilder.group({
        email: new FormControl('', Validators.compose([
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
        ])),
        password: new FormControl('', Validators.compose([
          Validators.required,
          // Validators.pattern('^(?=.*[0-9]+.*)(?=.*[a-zA-Z]+.*)[0-9a-zA-Z]{5,}$')
        ])),
      });

    }

   

   validation_messages = {
      'email': [
        { type: 'required', message: 'Email is required.' },
        { type: 'pattern', message: 'Please enter a valid email.' }
      ],
      'password': [
        { type: 'required', message: 'Password is required.' }
        // { type: 'pattern', message: 'Password must contain at least one letter, at least one number, and be longer than five charaters.' }
      ],
    };

async onSubmit(values) {
  this.showPostForm = false;
  var errors = true;
  var login = true;

  // console.log(this.login)
 // console.log("This is testing")

  const toast = await this.toastController.create({
  // header: 'Toast header',
   message: 'Invalid email or password',
   duration: 3000,
   position: 'top',
   buttons: [
      {
       text: 'X',
       role: 'cancel',
       handler: () => {
         console.log('Cancel clicked');
       }
   }
   ]
});


  const alert = await this.alertCtrl.create({
  header: 'Alert',
  subHeader: 'Subtitle',
  message: 'This is an alert message.',
  buttons: ['OK']
});

  this.lservice.createPost(this.login).subscribe(
  (data) => {
    this.posts = data;
   // error => this.error = error
    errors = false;
    login = true;
    // console.log(data)
    this.lservice.getUser(this.posts).subscribe(
      (res: Login) => {
        this.user = res;
        this.lservice.users = this.user;
      }
    );
    this.router.navigate(['/dashboard']);
  });

  setTimeout(function() {
    // console.log(errors)
    // console.log(login)
    if (errors && login) {
      // console.log("Invalid Id or Password")
      // this.errors = true;
      toast.present();
      // this.presentToast();
    }
    // else if (!errors && !login) {
    //   toast.present();
    // }
    // else if(login) {
    //   if(this.toast){
    //     this.toast.dismiss();
    //   }
    // }
  //   alert.present();
     }, 3000);
}
}
