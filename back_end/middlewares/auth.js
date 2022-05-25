const jwt = require("jsonwebtoken");

// Comment authentifier (Utilisateur et Administrateur) en comparaison avec le token :
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
    const userId = decodedToken.userId;
    const moderator = decodedToken.moderator;
    console.log(moderator);
    if (
      (req.body.userId && req.body.userId !== userId) ||
      req.body.moderator == false
    ) {
      throw "Nom d'utilisateur invalide!";
    } else if (req.body.isAdmin && req.body.isAdmin !== isAdmin) {
      console.log(isAdmin);
      return res.status(401).json({ error: "Administrateur invalide!" });
    } else {
      console.log(decodedToken);
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error("Requête invalide!"),
    });
  }
};
