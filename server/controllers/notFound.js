//Not Found page
const notFound = (req, res) => {
  res.status(404).render('notFound', {
    page: req.url,
  });
};
module.exports = {
    notFound
};