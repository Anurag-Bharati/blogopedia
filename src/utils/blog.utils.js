export const findTitle = (rawContentState) => {
  if (!rawContentState) return null;
  // loop and find the first header
  for (let i = 0; i < rawContentState.blocks.length; i++) {
    if (rawContentState?.blocks[i]?.type === "header-one") return rawContentState?.blocks[i]?.text;
  } // if no header found, return null
  return null;
};

export const calculateReadTime = (rawContentState) => {
  const words = rawContentState?.blocks?.reduce((acc, block) => acc + block.text.trim().split(/\s+/).length, 0);
  const minutes = Math.ceil(words / 200);
  return minutes;
};

export const scrollIntoView = (e) =>
  document.querySelector(`[data-offset-key="${e}-0-0"]`).scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });

export const pullHastags = (editorState) => {
  const tempHastags = [];
  editorState
    .getCurrentContent()
    .getBlocksAsArray()
    .forEach((block) => {
      if (block.getType() === "unstyled") {
        const text = block.getText();
        // hashtag regex
        const ht = text.match(/#[a-z]+/gi);
        // clean the ht
        if (ht) {
          ht.forEach((h) => {
            const clean = h.replace("#", "");
            if (!tempHastags.includes(clean)) tempHastags.push(clean);
          });
        }
      }
    });
  return tempHastags;
};

export const pullHeaders = (rawContentState) => {
  const tempHeaders = [];
  rawContentState.blocks.forEach((block) => {
    if (block.type === "header-one" || block.type === "header-two" || block.type === "header-three") tempHeaders.push(block);
  });
  return tempHeaders;
};

// compare array using JSON.stringify
export const isArrayDifferent = (arr1, arr2) => {
  if (JSON.stringify(arr1) !== JSON.stringify(arr2)) return true;
  return false;
};
// discard blocks with empty text and hashtags
export const getCleanPlainText = (rawContentState) => {
  return rawContentState?.blocks
    .filter((block) => !block.text.match(/#[a-zA-Z0-9]+/g))
    .filter((block) => block.text.trim() !== "")
    .reduce((acc, block) => acc + block.text + "\n", "");
};
