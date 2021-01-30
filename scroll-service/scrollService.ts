import {Injectable} from '@angular/core';

const DEFAULT_SCROLL_PADDING = .1 * window.innerHeight;
const SCROLL_TARGET_CLASS_NAME = '_scroll-target';  // Match theme.scss

/** A service for handling scrolling. */
@Injectable({
  providedIn: 'root',
})
export class ScrollService {
  scrollToTop(withSmooth = true): void {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: withSmooth ? 'smooth' : 'auto',
    });
  }

  scrollToTarget(
      targetId: string, scrollPadding = DEFAULT_SCROLL_PADDING,
      withSmooth = true): void {
    if (!targetId) return;
    const targetElement: HTMLElement|null =
        document.querySelector('#' + targetId);
    if (!targetElement) return;

    // Clear all existing classes
    for (const node of document.querySelectorAll(
             `.${SCROLL_TARGET_CLASS_NAME}`)) {
      node.classList.remove(SCROLL_TARGET_CLASS_NAME);
    }

    // Add the target class
    targetElement.classList.add(SCROLL_TARGET_CLASS_NAME);
    window.scrollTo({
      // Add 1 here, so the highlighting is correct.
      top: targetElement.offsetTop - scrollPadding + 1,
      left: 0,
      behavior: withSmooth ? 'smooth' : 'auto',
    });
  }

  /** Get the id of the first visible element. */
  getActiveSectionId(
      targetElements: HTMLElement[],
      scrollPadding = DEFAULT_SCROLL_PADDING): string|null {
    if (!targetElements.length) return null;
    let id = targetElements[0].id;
    for (const targetElement of targetElements) {
      if (targetElement.offsetTop <= window.scrollY + scrollPadding) {
        id = targetElement.id;
      }
    }
    return id;
  }
}