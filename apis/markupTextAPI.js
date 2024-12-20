const { markUpTohtml } = require("../repos/markupTextRepo");

module.exports = function (fastify, _, done) {
  fastify.post("/convertMarkUpText", async (req, res) => {
    const { markdownContent } = req.body;
    const htmlContent = await markUpTohtml(markdownContent);
    return {
      response: htmlContent,
    };
  });
  done();
};
