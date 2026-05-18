import { registerGoToCodeBlock } from "./go-to-code-block";
import {
  createReturnButtonController,
  registerReturnToContent,
} from "./return-to-reading-position";

const returnButton = document.querySelector<HTMLButtonElement>(
  "[data-code-reference-return]",
);

const codeReferenceState = {
  didJumpFromReference: false,
  returnTarget: null,
  returnScrollY: 0,
};

const { openReturnButton, closeReturnButton } =
  createReturnButtonController(returnButton);

registerReturnToContent({
  closeReturnButton,
  returnButton,
  state: codeReferenceState,
});

registerGoToCodeBlock({
  state: codeReferenceState,
  openReturnButton,
});
