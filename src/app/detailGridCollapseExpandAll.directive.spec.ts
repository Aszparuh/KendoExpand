import { DetailGridCollapseExpandAllDirective } from './detailGridCollapseExpandAll.directive';
import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ElementRef, Renderer2, Type, ViewChild, Component } from '@angular/core';
import { GridModule, GridComponent, GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Subscription } from 'rxjs';

const products = [{
    ProductID: 1,
    ProductName: 'Chai',
    SupplierID: 1,
    CategoryID: 1,
    QuantityPerUnit: '10 boxes x 20 bags',
    UnitPrice: 18.0000,
    UnitsInStock: 39,
    UnitsOnOrder: 0,
    ReorderLevel: 10,
    Discontinued: false,
    Category: {
        CategoryID: 1,
        CategoryName: 'Beverages',
        Description: 'Soft drinks, coffees, teas, beers, and ales'
    }
}, {
    ProductID: 2,
    ProductName: 'Chang',
    SupplierID: 1,
    CategoryID: 1,
    QuantityPerUnit: '24 - 12 oz bottles',
    UnitPrice: 19.0000,
    UnitsInStock: 17,
    UnitsOnOrder: 40,
    ReorderLevel: 25,
    Discontinued: false,
    Category: {
        CategoryID: 1,
        CategoryName: 'Beverages',
        Description: 'Soft drinks, coffees, teas, beers, and ales'
    }
}];

@Component({
    selector: 'tabs-rootmock',
    template: `<h1>
    {{title}}
  </h1>
  <kendo-grid smsHandleDetailGridCollapseAll
  [data]="gridView" [selectable]="false"
  [pageSize]="pageSize" [skip]="skip" [pageable]="true" [height]="800"
    (pageChange)="pageChange($event)">
    <kendo-grid-column field="ProductName" title="Product" [width]="300"></kendo-grid-column>
    <kendo-grid-column field="ProductID" title="ID" [width]="50"></kendo-grid-column>
    <kendo-grid-column field="UnitPrice" title="Unit Price" [width]="100"></kendo-grid-column>
    <kendo-grid-column field="QuantityPerUnit" title="Qty Per Unit"></kendo-grid-column>
    <ng-template kendoGridDetailTemplate let-dataItem>
      <section *ngIf="dataItem.Category">
        <p><strong>In Stock:</strong> {{dataItem.UnitsInStock}} units</p>
        <p><strong>On Order:</strong> {{dataItem.UnitsOnOrder}} units</p>
        <p><strong>Reorder Level:</strong> {{dataItem.ReorderLevel}} units</p>
        <p><strong>Discontinued:</strong> {{dataItem.Discontinued}}</p>
        <p><strong>Category:</strong> {{dataItem.Category?.CategoryName}} - {{dataItem.Category?.Description}}</p>
      </section>
    </ng-template>
    <ng-template kendoPagerTemplate let-totalPages="view.totalResultCount" let-currentPage="currentPage">
      <kendo-pager-prev-buttons></kendo-pager-prev-buttons>
      <kendo-pager-numeric-buttons [buttonCount]="10"></kendo-pager-numeric-buttons>
      <kendo-pager-next-buttons></kendo-pager-next-buttons>
      <kendo-pager-info></kendo-pager-info>
    </ng-template>
  </kendo-grid>`
})
class AppComponent {
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

class MockElementRef implements ElementRef {
    nativeElement = {
        querySelector: () => { }
    };
}

let component: AppComponent;
let fixture: ComponentFixture<AppComponent>;
let kendoElement: GridComponent;
let elementREf: ElementRef;
let detailsCollapseDirective: DetailGridCollapseExpandAllDirective;
let renderer2: Renderer2;

describe('DetailGridCollapseExpandAllDirective', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [DetailGridCollapseExpandAllDirective, AppComponent],
            imports: [
                ButtonsModule,
                BrowserAnimationsModule,
                GridModule
            ],
            providers: [
                { provide: ElementRef, useClass: MockElementRef },
                Renderer2
            ]
        }).compileComponents();
        fixture = TestBed.createComponent(AppComponent);
        component = fixture.componentInstance;
        kendoElement = component.grid;
        elementREf = TestBed.get(ElementRef);
        const directiveEl = fixture.debugElement.query(By.directive(DetailGridCollapseExpandAllDirective));
        detailsCollapseDirective = directiveEl.injector.get(DetailGridCollapseExpandAllDirective);
        renderer2 = fixture.componentRef.injector.get<Renderer2>(Renderer2 as Type<Renderer2>);

        spyOn(renderer2, 'addClass').and.callFake(() => {});
        spyOn(renderer2, 'removeClass').and.callFake(() => {});
        spyOn(renderer2, 'appendChild').and.callFake(() => {});
        spyOn(renderer2, 'listen').and.callFake(() => {});
        spyOn(elementREf.nativeElement, 'querySelector').and.callFake(() => {});
        spyOn(kendoElement.pageChange, 'subscribe').and.callFake(() => new Subscription());
        spyOn(kendoElement, 'expandRow').and.callThrough();
        spyOn(kendoElement, 'collapseRow').and.callThrough();
        spyOn(renderer2, 'createElement').and.callThrough();
    });

    describe('after view init', () => {
        it('should call addClass on renderer 2 times', async(() => {
            detailsCollapseDirective.ngAfterViewInit();
            expect(renderer2.addClass).toHaveBeenCalledTimes(2);
        }));

        it('should call listen on renderer', async(() => {
            detailsCollapseDirective.ngAfterViewInit();
            expect(renderer2.addClass).toHaveBeenCalled();
        }));

        it('should subscribes to pagechange', async(() => {
            detailsCollapseDirective.ngAfterViewInit();
            expect(kendoElement.pageChange.subscribe).toHaveBeenCalled();
        }));

        it('should call createElement on renderer', async(() => {
            detailsCollapseDirective.ngAfterViewInit();
            expect(renderer2.createElement).toHaveBeenCalledWith('a');
        }));
    });

    describe('expandAllDetails', () => {
        it('should call kendo expand row', async(() => {
            kendoElement.data = products;
            const count = kendoElement.view.total;
            detailsCollapseDirective.expandAllDetails();
            expect(kendoElement.expandRow).toHaveBeenCalledTimes(count);
        }));

        it('should call kendo collapse row', async(() => {
            kendoElement.data = products;
            const count = kendoElement.view.total;
            detailsCollapseDirective.expandAllDetails();
            detailsCollapseDirective.expandAllDetails();
            expect(kendoElement.collapseRow).toHaveBeenCalledTimes(count);
        }));

        it('should call removeClass', async(() => {
            detailsCollapseDirective.expandAllDetails();
            expect(renderer2.removeClass).toHaveBeenCalled();
        }));

        it('should call addClass', async(() => {
            detailsCollapseDirective.expandAllDetails();
            expect(renderer2.addClass).toHaveBeenCalled();
        }));
    });
});
