export const formatLiteral = (literal, params) => {
  let finalText = literal;
  for (let i = 0; i < params.length; i++) {
    let paramId = `{${i}}`;
    finalText = finalText.replace(paramId, params[i]);
  }
  return finalText;
};
