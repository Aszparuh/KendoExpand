import { Directive, ElementRef, Renderer2, ContentChild, AfterViewInit } from '@angular/core';
import { GridComponent, PageChangeEvent } from '@progress/kendo-angular-grid';

@Directive({
  selector: '[appExpand]'
})
export class ExpandDirective implements AfterViewInit {
  private _elementRef: ElementRef;
  private _areAllExpanded = false;
  private _link = document.createElement('a');
  @ContentChild(GridComponent) grid: GridComponent;

  constructor(elementRef: ElementRef, private renderer: Renderer2) {
    this._elementRef = elementRef;
  }

  private expandAllDetails() {
    if (this._areAllExpanded) {
      this.collapseAll();
    } else {
      this.expandAll();
    }
  }

  private collapseAll() {
    for (let i = 0; i < this.grid.view.total; i++) {
      this.grid.collapseRow(i);
      this._areAllExpanded = false;
      this._link.classList.remove('k-minus');
      this._link.classList.add('k-plus');
    }
  }

  private expandAll() {
    for (let i = 0; i < this.grid.view.total; i++) {
      this.grid.expandRow(i);
      this._areAllExpanded = true;
      this._link.classList.remove('k-plus');
      this._link.classList.add('k-minus');
    }
  }

  ngAfterViewInit(): void {
    this._link = document.createElement('a');
    this._link.classList.add('k-icon');
    this._link.classList.add('k-plus');
    this.renderer.listen(this._link, 'click', (event)  => {
      this.expandAllDetails();
    });

    this._link.href = '#';
    const el = this._elementRef.nativeElement.querySelector('.k-hierarchy-cell');
    el.appendChild(this._link);
    this.grid.pageChange.subscribe(() => {
      this._areAllExpanded = false;
      this.collapseAll();
    });
  }
}
