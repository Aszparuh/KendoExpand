import { Component, ViewChild } from '@angular/core';
import { products } from './products';
import { GridComponent, GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  public title = 'Kendo Grid';
  public gridView: GridDataResult;
  public pageSize = 25;
  public skip = 0;
  @ViewChild(GridComponent) grid: GridComponent;
  private _items: any[] = products;

  constructor() {
    this.loadItems();
  }

  public pageChange(event: PageChangeEvent): void {
    this.skip = event.skip;
    this.loadItems();
  }

  private loadItems(): void {
    this.gridView = {
      data: this._items.slice(this.skip, this.skip + this.pageSize),
      total: this._items.length
    };
  }
}
