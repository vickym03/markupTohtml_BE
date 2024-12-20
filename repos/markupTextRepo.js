const { marked } = require("marked");

const markUpTohtml = async (body) => {
  const htmlContent = marked(body); 
  return htmlContent;
};
module.exports = { markUpTohtml };
