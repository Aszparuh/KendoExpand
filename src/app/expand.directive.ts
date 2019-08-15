import { Directive, ElementRef, Renderer2, ContentChild, AfterViewInit } from '@angular/core';
import { GridComponent } from '@progress/kendo-angular-grid';

@Directive({
  selector: '[appExpand]'
})
export class ExpandDirective implements AfterViewInit {
  private _areAllExpanded = false;
  private _link: HTMLElement;
  @ContentChild(GridComponent) grid: GridComponent;

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {
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
    }

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

  ngAfterViewInit(): void {
    this._link = this.renderer.createElement('a');
    this._link.style.boxShadow = '0 0 0 0';
    this.renderer.addClass(this._link, 'k-icon');
    this.renderer.addClass(this._link, 'k-plus');
    this.renderer.listen(this._link, 'click', (event)  => {
      this.expandAllDetails();
    });

    this.renderer.setAttribute(this._link, 'href', '#');
    const el = this.elementRef.nativeElement.querySelector('.k-hierarchy-cell');
    el.appendChild(this._link);
    this.grid.pageChange.subscribe(() => {
      this._areAllExpanded = false;
      this.collapseAll();
    });
  }
}
