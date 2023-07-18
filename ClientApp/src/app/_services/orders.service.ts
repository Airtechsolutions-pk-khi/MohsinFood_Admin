import { Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { switchMap, tap, map } from 'rxjs/operators';
import { SortColumn, SortDirection } from '../_directives/sortable.directive';
import { State } from '../_models/State';
import { Orders } from '../_models/Orders';
import { Items } from '../_models/Items';
import DeliveryBoy from '../_models/DeliveryBoy';
import { Category } from '../_models/Cateogry';
import { Addons } from '../_models/Addons';
import { Modifiers } from 'popper.js';
import { Delivery } from '../_models/Delivery';


interface SearchOrdersResult {
  data: Orders[];
  total: number;
}
const compare = (v1: string, v2: string) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

function sort(data: Orders[], column: SortColumn, direction: string): Orders[] {
  if (direction === '' || column === '') {
    return data;
  } else {
    return [...data].sort((a, b) => {
      const res = compare(`${a[column]}`, `${b[column]}`);
      return direction === 'asc' ? res : -res;
    });
  }
}

function matches(data: Orders, term: string) {
  
  return data.customerName.toLowerCase().includes(term.toLowerCase())
}

@Injectable({
  providedIn: 'root'
})

export class OrdersService {

  constructor(private http: HttpClient) {
  }
  loadLocations(brandId) {
    return this.http.get<Location[]>(`api/location/all/${brandId}`);
  }
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _allData$ = new BehaviorSubject<Orders[]>([]);
  private _data$ = new BehaviorSubject<Orders[]>([]);
  private _total$ = new BehaviorSubject<number>(0);
  public orders: Orders[];
  private _state: State = {
    page: 1,
    pageSize: 10,
    searchTerm: '',
    sortColumn: '',
    sortDirection: ''
  };

  get total$() { return this._total$.asObservable(); }
  get loading$() { return this._loading$.asObservable(); }
  get page() { return this._state.page; }
  get pageSize() { return this._state.pageSize; }
  get searchTerm() { return this._state.searchTerm; }

  set page(page: number) { this._set({ page }); }
  set pageSize(pageSize: number) { this._set({ pageSize }); }
  set searchTerm(searchTerm: any) { this._set({ searchTerm }); }
  set sortColumn(sortColumn: SortColumn) { this._set({ sortColumn }); }
  set sortDirection(sortDirection: SortDirection) { this._set({ sortDirection }); }

  get data$() {
    return this._data$.asObservable();
  }
  
  get allData$() {
    return this._allData$.asObservable();
  }  
  
  getById(id,brandId) {
    debugger
    return this.http.get<any[]>(`api/orders/${id}/brand/${brandId}`);
  }
  getDeliveryBoys(brandId) {
    return this.http.get<DeliveryBoy[]>(`api/DeliveryBoy/all/${brandId}`)
  }
  printorder(id,brandId) {
    return this.http.get<Orders[]>(`api/orders/print/${id}`);
  }
 
  getAllData(brandID,locationID,fromDate,toDate) {

    const url = `api/orders/all/${brandID}/${locationID}/0/${fromDate}/${toDate}`;
    
    tap(() => this._loading$.next(true)),
      this.http.get<Orders[]>(url).subscribe(res => {
        this.orders = res;
           
        this._data$.next(this.orders);
        this._allData$.next(this.orders);

        this._search$.pipe(
          switchMap(() => this._search()),
          tap(() => this._loading$.next(false))
        ).subscribe(result => {
          this._data$.next(result.data);
          this._total$.next(result.total);
        });

        this._search$.next();
      });
  }

  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  private _search(): Observable<SearchOrdersResult> {
    const { sortColumn, sortDirection, pageSize, page, searchTerm } = this._state;

    // 1. sort
    let sortedData = sort(this.orders, sortColumn, sortDirection);

    //// 2. filter
    sortedData = sortedData.filter(data => matches(data, searchTerm));
    const total = sortedData.length;

    // 3. paginate
    const data = sortedData.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
    return of({ data, total });
  }

  clear() {
    // clear by calling subject.next() without parameters
    this._search$.next();
    this._data$.next(null);
    this._allData$.next(null);
    this._total$.next(null);
    this._loading$.next(null);
    this._state = {
      page: 1,
      pageSize: 10,
      searchTerm: '',
      sortColumn: '',
      sortDirection: ''
    };
  }

  loadCategory() {
    debugger
    return this.http.get<Category[]>(`api/category/allcategory/`);
  }

  // loadDeliveryArea() {
  //   debugger
  //   return this.http.get<Delivery[]>(`api/delivery/allarea/`);
  // }

  
  loadAddon() {
    debugger
    return this.http.get<Addons[]>(`api/addons/alladdons/`);
  }

  loadModifiers(itemid) {
    
    return this.http.get<Modifiers[]>(`api/item/getmodifiers/${itemid}`);
  }

  
  loadItems(categoryid) {
    debugger
    return this.http.get<Items[]>( `api/item/getitem/${categoryid}`);
  }
  update(updateData) {
    return this.http.post(`api/orders/update`, updateData)
      .pipe(map(res => {
         
        return res;
      }));
  }
 
  updatePayment(orders) {
    debugger
    return this.http.post(`api/orders/updatePay`, orders)
      .pipe(map(res => {
        console.log(res);
        return res;
      }));
  }  
  updateOrder(updateData) {
    debugger
    return this.http.post(`api/orders/edit`, updateData)
      .pipe(map(res => {
        console.log(res);
        return res;
      }));
  }
}
