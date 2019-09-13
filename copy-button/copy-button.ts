import {ChangeDetectorRef, Component, Input} from '@angular/core';

/**
 * A button to copy the current Url to the clipboard.
 */
@Component({
  selector: 'copy-button',
  templateUrl: './copy_button.ng.html',
  styleUrls: ['./copy_button.css']
})
export class CopyButton {
  @Input() text!: string;

  successToastVisible = false;

  constructor(private changeDetectorRef: ChangeDetectorRef) {}

  buttonClick() {
    if (this.copyToClipboard(this.text)) {
      this.toggleSuccessToast();
    }
  }

  /** Toggles success toast and fades after timeout. */
  toggleSuccessToast() {
    this.successToastVisible = true;
    setTimeout(() => {
      this.successToastVisible = false;
      this.changeDetectorRef.detectChanges();
    }, 3000);
  }

  copyToClipboard(text: string): boolean {
    const input = document.createElement('input');
    document.body.appendChild(input);
    input.value = text;
    input.select();

    let success = false;
    try {
      success = document.execCommand('copy');
    } catch (err) {
      console.error(err);
    }
    document.body.removeChild(input);
    return success;
  }
}
