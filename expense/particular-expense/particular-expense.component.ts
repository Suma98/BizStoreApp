import { Component, OnInit } from '@angular/core';
import { Params, Router, ActivatedRoute} from '@angular/router';
import { ExpenseService } from '../expense.service';
import { Expense} from '../../model/expense';
import { HttpParams } from '@angular/common/http';
import {Authkey} from '../../model/authkey';

@Component({
  selector: 'app-particular-expense',
  templateUrl: './particular-expense.component.html',
  styleUrls: ['./particular-expense.component.scss'],
})
export class ParticularExpenseComponent implements OnInit {

  particularexpense: Expense[] = [];

  height: number = 10;
  width: number = 10;
  imageurl: string=Authkey.getimageurl()
  styleimage(){
    return {width: this.width, height: this.height}
  }

  id;
  constructor(private expservice: ExpenseService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.expservice.refreshNeeded$
     .subscribe(() => {
       this.getexpense(this.id);
     });
    this.getexpense(this.id);

    }
    private getexpense(id: string) {
      
      this.expservice.getexpenses(this.id).subscribe((data: Expense[] )=> {
        
        this.particularexpense = data;
        console.table(data);
        });
      }

  }


