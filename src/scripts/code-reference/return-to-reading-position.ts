const RETURN_BUTTON_EXIT_DURATION_MS = 180;
const RETURN_TARGET_FLASH_DURATION_MS = 900;
const RETURN_TARGET_FLASH_CLASS = "is-return-target";

type CodeReferenceState = {
  didJumpFromReference: boolean;
  returnTarget: HTMLElement | null;
  returnScrollY: number;
};

type ReturnToContentOptions = {
  closeReturnButton: () => void;
  returnButton: HTMLButtonElement | null;
  state: CodeReferenceState;
};

const clearActiveHash = () => {
  history.replaceState(
    history.state,
    "",
    `${window.location.pathname}${window.location.search}`,
  );
};

const flashReturnTarget = (returnTarget: HTMLElement | null) => {
  if (!returnTarget) return;

  returnTarget.classList.remove(RETURN_TARGET_FLASH_CLASS);
  void returnTarget.offsetWidth;
  returnTarget.classList.add(RETURN_TARGET_FLASH_CLASS);

  window.setTimeout(() => {
    returnTarget.classList.remove(RETURN_TARGET_FLASH_CLASS);
  }, RETURN_TARGET_FLASH_DURATION_MS);
};

export const createReturnButtonController = (
  returnButton: HTMLButtonElement | null,
) => {
  let hideReturnButtonTimer: number | null = null;

  const openReturnButton = () => {
    if (!returnButton) return;

    if (hideReturnButtonTimer) {
      window.clearTimeout(hideReturnButtonTimer);
      hideReturnButtonTimer = null;
    }

    returnButton.hidden = false;

    requestAnimationFrame(() => {
      returnButton.classList.add("is-visible");
    });
  };

  const closeReturnButton = () => {
    if (!returnButton) return;

    returnButton.classList.remove("is-visible");

    if (hideReturnButtonTimer) {
      window.clearTimeout(hideReturnButtonTimer);
    }

    hideReturnButtonTimer = window.setTimeout(() => {
      returnButton.hidden = true;
      hideReturnButtonTimer = null;
    }, RETURN_BUTTON_EXIT_DURATION_MS);
  };

  return { openReturnButton, closeReturnButton };
};

export const registerReturnToContent = ({
  closeReturnButton,
  returnButton,
  state,
}: ReturnToContentOptions) => {
  const resetCodeReferenceState = () => {
    state.didJumpFromReference = false;
    state.returnTarget = null;
    state.returnScrollY = 0;
    closeReturnButton();
  };

  returnButton?.addEventListener("click", () => {
    if (!state.didJumpFromReference) return;

    window.scrollTo({
      top: state.returnScrollY,
      behavior: "smooth",
    });

    flashReturnTarget(state.returnTarget);
    clearActiveHash();
    resetCodeReferenceState();
  });

  const dismissReturnButton = () => {
    if (!state.didJumpFromReference) return;

    clearActiveHash();
    resetCodeReferenceState();
  };

  const dismissReturnButtonOnScrollKey = (event: KeyboardEvent) => {
    const scrollKeys = [
      "ArrowDown",
      "ArrowUp",
      "End",
      "Home",
      "PageDown",
      "PageUp",
      " ",
    ];

    if (!scrollKeys.includes(event.key)) return;
    dismissReturnButton();
  };

  window.addEventListener("wheel", dismissReturnButton, { passive: true });
  window.addEventListener("touchmove", dismissReturnButton, { passive: true });
  window.addEventListener("keydown", dismissReturnButtonOnScrollKey);

  window.addEventListener("hashchange", () => {
    if (window.location.hash) return;
    resetCodeReferenceState();
  });

  return { clearActiveHash, resetCodeReferenceState };
};
