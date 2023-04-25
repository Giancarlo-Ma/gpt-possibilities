export const useGptTip = () => {
  const tipShow = ref(false);
  const selectedContent = ref("");
  const top = ref(0);
  const left = ref(0);
  if (process.client) {
    useEventListener(document, "mouseup", () => {
      const selection = window.getSelection()?.toString();
      if (selection) {
        const range = window.getSelection()?.getRangeAt(0);
        const boundingRect = range?.getBoundingClientRect();
        tipShow.value = true;
        selectedContent.value = selection;
        top.value = boundingRect?.bottom || 0 + window.pageYOffset;
        left.value = boundingRect?.left || 0 + window.pageXOffset;
      } else {
        tipShow.value = false;
      }
    });
  }

  return {
    tipShow,
    selectedContent,
    top,
    left,
  };
};
