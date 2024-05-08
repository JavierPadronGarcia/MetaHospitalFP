// TODO : UPDATE TO GET REQUEST TRANSLATION PROPPERLY
exports.getRequestedTranslation = (req, res, next) => {
  const language = req.headers['required-language-response'];

  if (!language) {
    req.body.language = 'en';
  } else {
    req.body.language = language;
  }

  next();
}