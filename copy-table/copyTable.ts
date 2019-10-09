export function copyTable(el: HTMLElement) {
  selectElementContents(el);
  copyToClipboard();
}

function selectElementContents(el: HTMLElement) {
  const body = document.body;
  let range, sel;
  if (document.createRange && window.getSelection) {
    range = document.createRange();
    sel = window.getSelection();
    sel!.removeAllRanges();
    try {
      range.selectNodeContents(el);
      sel!.addRange(range);
    } catch (e) {
      range.selectNode(el);
      sel!.addRange(range);
    }
  }
}

function copyToClipboard(): boolean {
  let success = false;
  try {
    success = document.execCommand('copy');
  } catch (err) {
    console.error(err);
  }
  return success;
}
