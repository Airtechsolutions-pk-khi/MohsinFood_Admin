import { Component, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OrdersService } from 'src/app/_services/orders.service';
import { ToastService } from 'src/app/_services/toastservice';
import { ActivatedRoute, Router } from '@angular/router';
@Component({

  selector: 'app-orderdetails', 
  // templateUrl:'./modal-OrderDetail.component.html'
  template: `
 <div class="modal-header">
    
    <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
      <span aria-hidden="true">&times;</span>
    </button>
  </div>
  <div class="modal-body">
   
<div class="card shadow mb-4">
  <div class="card-header py-3">
      <div class="row">
          <div class="col-md-6">
              <h6 class="m-0 font-weight-bold text-orange">Order Details - <span class="badge badge-info"> {{ dataObj.order.statusID == 100 ? "Delivered" : dataObj.order.statusID==101 ?"Order confirmed" : dataObj.order.statusID == 102? "Order prepared" : dataObj.order.statusID == 103? " Order out for delivery" : dataObj.order.statusID == 104? "Order Cancelled" : "-" }}</span></h6>
          </div>
          <div class="col-md-6 text-right">
          <button class="btn btn-warning text-right" (click)="updatePayment(dataObj.order);" >
          <i class="fas fa-check-circle"></i> Recalculate
        </button>  
          </div>
      </div>
      <hr/>
      <div class="row">
      <div class="col-md-12 mb-4" *ngIf="dataObj.order.statusID!=100">
              <div class="card border-left-info shadow mb-4">
                  <div class="card-header border-bottom-0">Order Status</div>
                  <div class="card-body">
                    <div class="">
                      <button class="btn btn-warning mr-1" (click)="updateOrder(dataObj.order,102)" *ngIf="dataObj.order.statusID!=102">
                        <i class="fas fa-check-circle"></i> Prepared
                      </button>
                      <button class="btn btn-info mr-1" (click)="updateOrder(dataObj.order,103)" *ngIf="dataObj.order.statusID!=103">
                        <i class="fas fa-truck"></i> Out For Delivery
                      </button>
                      <button class="btn btn-success mr-1" (click)="updateOrder(dataObj.order,100)" *ngIf="dataObj.order.statusID!=100">
                        <i class="fas fa-people-carry"></i> Delivered
                      </button>
                      <button class="btn btn-danger mr-1" (click)="updateOrder(dataObj.order,104)">
                        <i class="fas fa-people-carry"></i> Cancelled
                      </button>
                      
                    </div>
                  </div>
              </div>
          </div>


          
          <div class="col-md-6 mb-4">

              <div class="card border-left-success shadow mb-4">
                  <div class="card-body">
                      <div class="card">
                          <div class="card-header border-bottom-0">Customer Information</div>

                          <div class="d-flex align-items-center">
                              <div class="flex-grow-1">
                                  <div class="list-group list-group-flush small">
                                      <a class="list-group-item list-group-item-action" href="#!">
                                    Customer Name
                                  </a>
                                  </div>
                              </div>
                              <div class="mr-2">{{ dataObj.customerOrders.name }}</div>
                          </div>
                          <div class="d-flex align-items-center">
                              <div class="flex-grow-1">
                                  <div class="list-group list-group-flush small">
                                      <a class="list-group-item list-group-item-action" href="#!">
                                   Email
                                  </a>
                                  </div>
                              </div>
                              <div class="mr-2">{{ dataObj.customerOrders.email }}</div>
                          </div>
                          <div class="d-flex align-items-center">
                              <div class="flex-grow-1">
                                  <div class="list-group list-group-flush small">
                                      <a class="list-group-item list-group-item-action" href="#!">
                                    Address
                                  </a>
                                  </div>
                              </div>
                              <div class="mr-2">{{ dataObj.customerOrders.addressNickName }}</div>



                          </div>
                          <div class="d-flex align-items-center">
                              <div class="flex-grow-1">
                                  <div class="list-group list-group-flush small">
                                      <a class="list-group-item list-group-item-action" href="#!">
                                  Google Address
                                  </a>
                                  </div>
                              </div>
                              <div class="mr-2">{{ dataObj.customerOrders.address }} | Latitude: {{ dataObj.customerOrders.latitude }}| Longitude: {{ dataObj.customerOrders.longitude }}</div>



                          </div>
                          <div class="d-flex align-items-center">
                              <div class="flex-grow-1">
                                  <div class="list-group list-group-flush small">
                                      <a class="list-group-item list-group-item-action" href="#!">
                                     Contact Number
                                  </a>
                                  </div>
                              </div>
                              <div class="mr-2">{{ dataObj.customerOrders.mobile }}</div>
                          </div>
                          
                      </div>
                  </div>
              </div>
              <div class="card border-left-warning shadow ">

                  <div class="card-body">

                      <!-- Report summary card example-->
                      <div class="card">
                          <div class="card-header border-bottom-0">Order Information</div>

                          <div class="d-flex align-items-center">
                              <div class="flex-grow-1">
                                  <div class="list-group list-group-flush small">
                                      <a class="list-group-item list-group-item-action" href="#!">
                                         Order No
                                      </a>
                                  </div>
                              </div>
                              <div class="mr-2">{{ dataObj.order.orderNo }}</div>
                          </div>
                          <div class="d-flex align-items-center">
                              <div class="flex-grow-1">
                                  <div class="list-group list-group-flush small">
                                      <a class="list-group-item list-group-item-action" href="#!">
                                         Transaction No
                                      </a>
                                  </div>
                              </div>
                              <div class="mr-2">{{ dataObj.order.transactionNo }}</div>
                          </div>
                          <div class="d-flex align-items-center">
                              <div class="flex-grow-1">
                                  <div class="list-group list-group-flush small">
                                      <a class="list-group-item list-group-item-action" href="#!">
                                         Order Type
                                      </a>
                                  </div>
                              </div>
                              <div class="mr-2">{{ dataObj.order.orderType=='1'?'Home': dataObj.order.orderType=='2'?'Work':'Other' }}</div>
                          </div>
                          <div class="d-flex align-items-center">
                              <div class="flex-grow-1">
                                  <div class="list-group list-group-flush small">
                                      <a class="list-group-item list-group-item-action" href="#!">
                                        Order Date
                                      </a>
                                  </div>
                              </div>
                              <div class="mr-2">{{ dataObj.order.orderDate | date }}</div>
                          </div>
                          
                          <div class="d-flex align-items-center">
                              <div class="flex-grow-1">
                                  <div class="list-group list-group-flush small">
                                      <a class="list-group-item list-group-item-action" href="#!">
                                       Status
                                      </a>
                                  </div>
                              </div>

                              <div class="mr-2">
                                  {{ dataObj.order.statusID == 100 ? "Delivered" : dataObj.order.statusID==101 ?"Order confirmed" : dataObj.order.statusID == 102? "Order prepared" : dataObj.order.statusID == 103? " Order out for delivery" : dataObj.order.statusID == 104? "Order Cancelled" : "-" }}
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
          <div class="col-md-6 mb-4">
              <div class="card border-left-danger shadow mb-4">

                  <div class="card-body">
                      <div class="card">
                          <div class="card-header border-bottom-0">Billing Information</div>

                          <div class="d-flex align-items-center">
                              <div class="flex-grow-1">
                                  <div class="list-group list-group-flush small">
                                      <a class="list-group-item list-group-item-action" href="#!">
                                Amount Total
                              </a>
                                  </div>
                              </div>
                              <div class="mr-2">{{ (dataObj.orderCheckouts.amountPaid | number : '1.2-2')}}</div>
                          </div>
                          <div class="d-flex align-items-center">
                              <div class="flex-grow-1">
                                  <div class="list-group list-group-flush small">
                                      <a class="list-group-item list-group-item-action" href="#!">
                                Discount
                              </a>
                                  </div>
                              </div>
                              <div class="mr-2">{{ (dataObj.orderCheckouts.discountAmount | number : '1.2-2')}}</div>
                          </div>
                          <div class="d-flex align-items-center">
                              <div class="flex-grow-1">
                                  <div class="list-group list-group-flush small">
                                      <a class="list-group-item list-group-item-action" href="#!">
                                Tax
                              </a>
                                  </div>
                              </div>
                              <div class="mr-2">{{ (dataObj.orderCheckouts.tax | number : '1.2-2')}}</div>
                          </div>
                          <div class="d-flex align-items-center">
                              <div class="flex-grow-1">
                                  <div class="list-group list-group-flush small">
                                      <a class="list-group-item list-group-item-action" href="#!">
                                Service Charges
                              </a>
                                  </div>
                              </div>
                              <div class="mr-2">{{ (dataObj.orderCheckouts.serviceCharges | number : '1.2-2')}}</div>
                          </div>
                          <div class="d-flex align-items-center">
                              <div class="flex-grow-1">
                                  <div class="list-group list-group-flush small">
                                      <a class="list-group-item list-group-item-action" href="#!">
                         Grand Total
                              </a>
                                  </div>
                              </div>
                              <div class="mr-2">{{ (dataObj.orderCheckouts.grandTotal | number : '1.2-2')}}</div>
                          </div>

                      </div>
                  </div>
              </div>
              <div class="card border-left-primary shadow">

                  <div class="card-body">
                      <div class="tile-body p-0 table-responsive ">
                          <table class="table table-striped">
                              <thead>
                                  <tr class="table-header">
                                      <th width="25%">Name </th>
                                      <th width="25">Quantity</th>
                                      <th width="25">Price</th>
                                      
                                  </tr>
                              </thead>
                              <tbody>
                                  <tr *ngFor="let item of dataObj.orderDetails ">
                                      <td> {{item.name}}
                                          <tr *ngFor="let item1 of item.orderDetailModifiers ">
                                              <td class="badge badge-pill">Modifier: {{item1.modifierName }} [{{item.Quantity}}X {{item1.price}} ] </td>
                                          </tr>

                                          <tr *ngFor="let item2 of item.orderDetailAddons ">
                                          <td class="badge badge-pill">Addon: {{item2.addonName }} [{{item.Quantity}}X {{item2.price}} ] </td>
                                      </tr>

                                      </td>
                                      <td> {{item.quantity}} </td>
                                      <td> {{item.price}} </td>
                                      
                                  </tr>
                              </tbody>
                          </table>
                      </div>

                  </div>

              </div>
          </div>

      </div>

  </div>
</div>    
  </div>
  <div class="modal-footer">
    <button type="button" class="btn btn-outline-dark" (click)="activeModal.close('Close click')">Close</button>
  </div>

`,
 
  
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

  updatePayment(orders) {
    debugger
      
    this.service.updatePayment(orders).subscribe(data => {

      if (data != 0) {
        this.ts.showSuccess("Success", "Record updated successfully.");
        this.router.navigate(['/admin/orders']);
        this.activeModal.close('Close click');
      }
    }, error => {
      this.ts.showError("Error", "Failed to update record.")
    });
  }
}
