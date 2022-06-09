import { Component, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OrdersService } from 'src/app/_services/orders.service';
import { ToastService } from 'src/app/_services/toastservice';
import { ActivatedRoute, Router } from '@angular/router';
@Component({

  selector: 'app-orderdetails', 
  templateUrl:'./modal-OrderDetail.component.html'
  
})
export class NgbdModalContent {
  
  @Input() name;
  dataObj: any = []; 
  constructor(public activeModal: NgbActiveModal,public service: OrdersService,
    public ts: ToastService,
    public router: Router) {}    


  updateOrder(order, status) {
    debugger
    order.statusID = status;
    //Update customer
    this.service.update(order).subscribe(data => {

      if (data != 0) {
        this.ts.showSuccess("Success", "Record updated successfully.")
        this.router.navigate(['/admin/orders']);
      }
    }, error => {
      this.ts.showError("Error", "Failed to update record.")
    });
  }
}
