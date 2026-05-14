const AUTO_HIDE_SCROLL_DELAY_MS = 700;
const CODE_BLOCK_FLASH_DURATION_MS = 1200;
const REFERENCED_CODE_BLOCK_CLASS = "is-referenced";
const CODE_BLOCK_SELECTOR = ".expressive-code .frame, figure.frame";
const CODE_REFERENCE_LINK_SELECTOR = "a[href^='#']";

type CodeReferenceState = {
  didJumpFromReference: boolean;
  ignoreScrollUntil: number;
  returnTarget: HTMLElement | null;
  returnScrollY: number;
};

type GoToCodeBlockOptions = {
  state: CodeReferenceState;
  openReturnButton: () => void;
};

const findCodeReferenceTarget = (anchor: HTMLAnchorElement) => {
  const hash = anchor.getAttribute("href");
  if (!hash || hash === "#") return null;

  const target = document.getElementById(hash.slice(1));
  if (!(target instanceof HTMLElement)) return null;
  if (!target.matches(CODE_BLOCK_SELECTOR)) return null;

  return { hash, target };
};

const findReturnTarget = (anchor: HTMLAnchorElement) =>
  anchor.closest<HTMLElement>("p, li, blockquote, pre, figure, h2, h3, h4") ??
  anchor;

const flashCodeBlockReference = (codeBlock: HTMLElement) => {
  codeBlock.classList.remove(REFERENCED_CODE_BLOCK_CLASS);
  void codeBlock.offsetWidth;
  codeBlock.classList.add(REFERENCED_CODE_BLOCK_CLASS);

  window.setTimeout(() => {
    codeBlock.classList.remove(REFERENCED_CODE_BLOCK_CLASS);
  }, CODE_BLOCK_FLASH_DURATION_MS);
};

const shouldHandleCodeReferenceClick = (event: MouseEvent) =>
  !(
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  );

export const registerGoToCodeBlock = ({
  state,
  openReturnButton,
}: GoToCodeBlockOptions) => {
  document.addEventListener("click", (event) => {
    if (!shouldHandleCodeReferenceClick(event)) return;

    const anchor =
      event.target instanceof HTMLElement
        ? event.target.closest<HTMLAnchorElement>(CODE_REFERENCE_LINK_SELECTOR)
        : null;

    if (!anchor) return;

    const codeReferenceTarget = findCodeReferenceTarget(anchor);
    if (!codeReferenceTarget) return;

    event.preventDefault();

    state.didJumpFromReference = true;
    state.ignoreScrollUntil =
      window.performance.now() + AUTO_HIDE_SCROLL_DELAY_MS;
    state.returnTarget = findReturnTarget(anchor);
    state.returnScrollY = window.scrollY;

    openReturnButton();
    history.replaceState(history.state, "", codeReferenceTarget.hash);
    codeReferenceTarget.target.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    flashCodeBlockReference(codeReferenceTarget.target);
  });
};
