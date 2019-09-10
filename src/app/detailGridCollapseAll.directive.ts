import { Directive, ElementRef, Renderer2, ContentChild, AfterViewInit, OnInit, OnDestroy } from '@angular/core';
import { GridComponent } from '@progress/kendo-angular-grid';
import { Subscription } from 'rxjs';

@Directive({ selector: 'kendo-grid[smsHandleDetailGridCollapseAll]' })
export class DetailGridCollapseAllDirective implements AfterViewInit, OnInit, OnDestroy {
  private _areAllExpanded = false;
  private _link: HTMLElement;
  private _pageChangeSubscription: Subscription;
  @ContentChild(GridComponent) grid: GridComponent;

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {
  }

  ngOnInit(): void {
    this.grid.onDataChange = (() => {
      this.collapseAll();
    });
  }

  ngAfterViewInit(): void {
    this._link = this.renderer.createElement('a');
    this.renderer.addClass(this._link, 'k-icon');
    this.renderer.addClass(this._link, 'k-plus');
    this.renderer.listen(this._link, 'click', ()  => {
      this.expandAllDetails();
    });

    this.renderer.setAttribute(this._link, 'href', '#');
    const el = this.elementRef.nativeElement.querySelector('.k-hierarchy-cell');
    this.renderer.appendChild(el, this._link);
    this._pageChangeSubscription = this.grid.pageChange.subscribe(() => {
      this._areAllExpanded = false;
      this.collapseAll();
    });
  }

  ngOnDestroy(): void {
    this._pageChangeSubscription.unsubscribe();
  }

  public expandAllDetails() {
    if (this._areAllExpanded) {
      this.collapseAll();
    } else {
      this.expandAll();
    }
  }

  private collapseAll() {
    for (let i = 0; i < this.grid.view.total; i++) {
      this.grid.collapseRow(i);
    }

    this._areAllExpanded = false;
    this.renderer.removeClass(this._link, 'k-minus');
    this.renderer.addClass(this._link, 'k-plus');
  }

  private expandAll() {
    for (let i = 0; i < this.grid.view.total; i++) {
      this.grid.expandRow(i);
    }

    this._areAllExpanded = true;
    this.renderer.removeClass(this._link, 'k-plus');
    this.renderer.addClass(this._link, 'k-minus');
  }
}
