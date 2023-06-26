import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastService } from 'src/app/_services/toastservice';
import { OrdersService } from 'src/app/_services/orders.service';
import { OrderDetails } from 'src/app/_models/Orders';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

import { LocalStorageService } from 'src/app/_services/local-storage.service';
import { NgbdDatepickerRangePopup } from 'src/app/datepicker-range/datepicker-range-popup';
@Component({
  selector: 'app-editorder',
  templateUrl: './editorder.component.html',
  styleUrls: ['./editorder.component.css']
})
export class EditorderComponent implements OnInit {
  submitted = false;
  orderForm: FormGroup;
  loading = false;
  loadingItems = false;
  private selectedBrand;
  Images = [];
  public odetail = new OrderDetails();
  OrderDetailList = [];
  ItemsList = [];
  model: NgbDateStruct;
  @ViewChild(NgbdDatepickerRangePopup, { static: true }) dateObj;
  constructor(
    private formBuilder: FormBuilder,
    public ls: LocalStorageService,
    private router: Router,
    private route: ActivatedRoute,
    public ts: ToastService,
    private oService: OrdersService
  ) {
    this.selectedBrand = this.ls.getSelectedBrand().brandID;
    this.createForm();
    this.loadItems();
    // this.loadSubCategory();
    this.setSelecteditem();
  }

  ngOnInit() {

  }

  get f() { return this.orderForm.controls; }

  private createForm() {
    this.orderForm = this.formBuilder.group({

      senderName: [''],
      senderEmail: [''],
      senderContact: [''],
      senderAddress: [''],
      customerName: [''],
      contactNo: [''],
      email: [''],
      cardNotes: [''],
      address: [''],
      nearestPlace: [''],
      deliveryDate: [''],
      deliveryTime: [''],
      placeType: [''],
      selectedTime: [''],
      orderID: 0,
      orderDetails: []
    });
  }
  private editForm(obj) {

    this.OrderDetailList = obj.orderDetails;
    this.f.senderName.setValue(obj.customerOrders.senderName);
    this.f.senderEmail.setValue(obj.customerOrders.senderEmail);
    this.f.senderContact.setValue(obj.customerOrders.senderContact);
    this.f.senderAddress.setValue(obj.customerOrders.senderAddress);
    this.f.customerName.setValue(obj.customerOrders.customerName);
    this.f.contactNo.setValue(obj.customerOrders.contactNo);
    this.f.email.setValue(obj.customerOrders.email);
    this.f.address.setValue(obj.customerOrders.address);
    this.f.orderID.setValue(obj.order.orderID);
    this.f.cardNotes.setValue(obj.customerOrders.cardNotes);
    
    this.f.nearestPlace.setValue(obj.customerOrders.nearestPlace);
    this.f.deliveryDate.setValue(obj.customerOrders.deliveryDate);
    this.f.deliveryTime.setValue(obj.customerOrders.selectedTime);
    this.f.selectedTime.setValue(obj.customerOrders.selectedTime);

    this.dateObj.model = { day: new Date(obj.customerOrders.deliveryDate).getDate(), month: new Date(obj.customerOrders.deliveryDate).getMonth(), year: new Date(obj.customerOrders.deliveryDate).getFullYear() };

  }

  setSelecteditem() {
    this.route.paramMap.subscribe(param => {
      const sid = +param.get('id');
      if (sid) {
        this.loadingItems = true;
        this.f.orderID.setValue(sid);
        this.oService.getById(sid,this.selectedBrand).subscribe(res => {
          //Set Forms
          this.editForm(res);
          this.loadingItems = false;
        });
      }
    })
  }

  onSubmit() {

    this.orderForm.markAllAsTouched();
    this.submitted = true;
    if (this.orderForm.invalid) { return; }
    this.loading = true;
    this.f.orderDetails.setValue(this.OrderDetailList);
    this.f.deliveryDate.setValue(this.dateObj.model.year + "-" + this.dateObj.model.month + "-" + this.dateObj.model.day);
    // this.f.categories.setValue(this.selectedCategoryIds == undefined ? "" : this.selectedCategoryIds.toString());
    // this.f.subcategories.setValue(this.selectedSubCategoryIds == undefined ? "" : this.selectedSubCategoryIds.toString());
    // this.f.statusID.setValue(this.f.statusID.value === true ? 1 : 2);
    if (parseInt(this.f.orderID.value) === 0) {


    } else {
      debugger;
      //Update order
      this.oService.updateOrder(this.orderForm.value).subscribe(data => {
        this.loading = false;
        if (data != 0) {
          this.ts.showSuccess("Success", "Record updated successfully.")
          this.router.navigate(['/admin/orders']);
        }
      }, error => {
        this.ts.showError("Error", "Failed to update record.")
        this.loading = false;
      });
    }
  }

  // private loadCategory() {
  //   this.oService.loadCategories().subscribe((res: any) => {
  //     // this.CategoryList = res;
  //   });
  // }
  private loadItems() {
    debugger
    this.oService.loadItems(this.selectedBrand).subscribe((res: any) => {

      this.ItemsList = res;
    });
  }


  RemoveChild(obj) {
    const index = this.OrderDetailList.indexOf(obj);
    this.OrderDetailList.splice(index, 1);
  }
  AddChild(val) {
   
   var obj = this.ItemsList.find(element => element.itemID == val.itemID);
    if (val.itemID != null) {
      if (!this.OrderDetailList.find(element => element.itemID == val.itemID)) {
        this.OrderDetailList.push({
          name: obj.name,
          price: obj.price == null ? 0 : obj.price,
          quantity: val.quantity == null ? 1 : val.quantity,

          total: val.quantity * obj.price,
          itemID: obj.itemID,
          image: obj.image == null ? 0 : obj.image
        });
      }
      else {
        alert("Item already added in list")
      }
      this.clear();
    }
  }
  clear() {
    this.odetail.quantity = 1;
    this.odetail.price = 0;

  }
}
