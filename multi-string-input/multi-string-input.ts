import {Component, Input, OnInit} from '@angular/core';

/**
 * A multi string input component
 */
@Component({
  selector: 'multi-string-input',
  template: `<textarea [value]="value" (change)="updateValue($event.target.value)"></textarea>`,
})
export class MultiStringInput implements OnInit {
  @Input() list: string[] = [];

  ngOnInit() {
    if (!this.list) {
      throw new Error(`Item list is required`)
    }
  }

  get value(): string {
    return this.list.join('\n');
  }

  updateValue(value: string) {
    this.list = value.split('\n').map((v: string) => v.trim()).filter(String);
  }
}
