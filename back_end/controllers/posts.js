const db = require("../models");
const { Posts, Comment } = db.sequelize.models;
const fs = require("fs");
const jwt = require("jsonwebtoken");

// Comment récupérer tous les posts :
exports.getAllPosts = (req, res) => {
  Posts.findAll()
    .then((posts) => res.status(200).json(posts))
    .catch((error) => res.status(400).json({ error }));
};



// On récupère les commentaires pour chaque post (nouveau au 27/07/2022)
const getCommentCount = (post_id) => {
  return new Promise((resolve, reject) => {
    try {
      const string = "SELECT COUNT(*) as comments FROM comments WHERE Posts_id = ?";
      const inserts = [post_id];
      const sql = mysql.format(string, inserts);

      // La requête :
      const commentCount = db.query(sql, (error, comments) => {
        if (error) reject(error);
        resolve(comments[0].comments);
      });
    } catch (err) {
      reject(err);
    }
  });
};

// on va chercher la réaction pour chaque post
const composePost = async () => {
  try {
    // Le résultat des posts
    let finalPost = await getMostLiked();
    // Pour chaque post, on vérifie les commentaires et on les ajoute
    for (let i = 0; i < finalPost.length; i++) {
      // Le résultat des commentaires
      const comments = await getCommentCount(finalPost[i].post_id);
      finalPost[i].comments = comments;
    }
    return finalPost;
  } catch (err) {
    return new Error(err);
  }
};

composePost()
  .then((result) => {
    res.status(200).json(result);
  })
  .catch((error) => {
    return next(new HttpError("Requête en erreur, les publications n'ont pas pu être récupérées", 500));
  });

exports.getOnePost = (req, res, next) => {
  const user = decodeUid(req.headers.authorization);
  let postId = req.params.id;

  const postSql = `SELECT
                      u.id AS user_id,
                      u.firstName,
                      u.lastName,
                      u.photo_url,
                      p.title,
                      p.post_date,
                      p.image_url,
                      p.id AS post_id,
                      c.category,
                  COUNT(if(r.reaction = 'like', 1, NULL)) AS likes,
                  COUNT(if(r.reaction = 'dislike', 1, NULL)) AS dislikes,
                      (SELECT reaction FROM reactions WHERE Users_id = ? AND Posts_id = r.Posts_id) AS userReaction
                  FROM posts AS p
                  LEFT JOIN reactions AS r ON p.id = r.Posts_id
                  JOIN categories AS c ON p.Categories_id = c.id
                  JOIN users AS u ON p.Users_id = u.id
                  WHERE p.id = ?
                  GROUP BY p.id `;

  const commentsSql = `SELECT 
                          users.id AS user_id, 
                          users.firstName, 
                          users.lastName, 
                          users.photo_url, 
                          comments.id, 
                          comments.comment_date, 
                          comments.message 
                      FROM comments 
                      INNER JOIN users ON comments.Users_id = users.id 
                      WHERE Posts_id = ?`;
  db.query(`${postSql}; ${commentsSql}`, [user.id, postId, postId], (error, result, fields) => {
    if (!error) {
      // "results" : Il s'agit d'un tableau avec un élément de post plus un élément avec les commentaires
      let results = [
        {
          // On copie le résultat de la première requête (cf. post)
          ...result[0][0],

          // On incrémente le compte des commmentaires
          commentsCounter: result[1].length,
        },
        {
          // On ajoute les commmentaires de la deuxième requête (cf. commentaires)
          comments: [...result[1]],
        },
      ];
      res.status(200).json(results);
    } else {
      return next(new HttpError("Requête en erreur, la publication n'a pas pu être obtenue", 500));
    }
  });
};

// Réactions aux posts :
exports.postReaction = (req, res, next) => {
  const user = decodeUid(req.headers.authorization);
  const { reaction, post_id, reacted } = req.body;

  console.log("frontend info =>", req.body);

  switch (reaction) {
    case "like": // Like Post
      try {
        let string;
        if (!reacted) {
          string = "INSERT INTO reactions (Posts_id, Users_id, reaction) VALUES (?, ?, 'like')";
        } else {
          string = "UPDATE reactions SET reaction = 'like' WHERE Posts_id = ? AND Users_id = ?";
        }
        const inserts = [post_id, user.id];
        const sql = mysql.format(string, inserts);

        const likePost = db.query(sql, (error, result) => {
          if (error) throw error;
          res.status(200).json({ message: "like post successfully!" });
        });
      } catch (err) {
        return next(
          new HttpError("Requête en erreur, votre réaction à la publication n'a pas pu être enregistrée", 500)
        );
      }

      break;
    case "dislike": // Dislike Post
      try {
        let string;
        if (!reacted) {
          string = "INSERT INTO reactions (Posts_id, Users_id, reaction) VALUES (?, ?, 'dislike')";
        } else {
          string = "UPDATE reactions SET reaction = 'dislike' WHERE Posts_id = ? AND Users_id = ?";
        }
        const inserts = [post_id, user.id];
        const sql = mysql.format(string, inserts);

        const dislikePost = db.query(sql, (error, result) => {
          if (error) throw error;
          res.status(200).json({ message: "dislike post successfully!" });
        });
      } catch (err) {
        return next(
          new HttpError("Requête en erreur, votre réaction à la publication n'a pas pu être enregistrée", 500)
        );
      }
      break;
    case "null": // Like ou Dislike Post
      try {
        const string = "UPDATE reactions SET reaction = 'null' WHERE Posts_id = ? AND Users_id = ?";
        const inserts = [post_id, user.id];
        const sql = mysql.format(string, inserts);

        const updateReaction = db.query(sql, (error, result) => {
          if (error) throw error;
          res.status(200).json({ message: "post reaction nulled successfully!" });
        });
      } catch (err) {
        return next(
          new HttpError("Requête en erreur, votre réaction à la publication n'a pas pu être enregistrée", 500)
        );
      }
      break;
  }
};

// Controller d'annulation des posts (ou publications)
exports.deletePost = (req, res, next) => {
  const user = decodeUid(req.headers.authorization);

  let string = "";
  let inserts = [];
  const imagePath = `/images/${req.body.image_url.split("/")[4]}`;

  // On vérifie si c'est l'administrateur ou l'utilisateur qui annule le post (ou la publication)
  if (user.clearance === "admin") {
    string = "DELETE FROM posts WHERE id = ?";
    inserts = [req.params.id];
    console.log("admin");
  } else {
    string = "DELETE FROM posts WHERE id = ? AND Users_id = ?";
    inserts = [req.params.id, user.id];
    console.log("user");
  }
  const sql = mysql.format(string, inserts);

  const deletePost = db.query(sql, (error, result) => {
    if (!error) {
      // On supprime l'image dans le serveur
      fs.unlink(imagePath, (err) => {
        console.log(err);
      });
      res.status(200).json({ message: "Publication annulée avec succès!" });
    } else {
      return next(new HttpError("Requête en erreur, la publication n'a pas pu être supprimée", 500));
    }
  });
};

// Controller d'annulation des commentaires :
exports.deleteComment = (req, res, next) => {
  const user = decodeUid(req.headers.authorization);

  let string = "";
  let inserts = [];

  // On vérifie qui annule (l'administrateur ou l'utilisateur)
  if (user.clearance === "admin") {
    string = "DELETE FROM comments WHERE id = ?";
    inserts = [req.params.id];
    console.log("admin");
  } else {
    string = "DELETE FROM comments WHERE id = ? AND Users_id = ?";
    inserts = [req.params.id, user.id];
    console.log("user");
  }
  const sql = mysql.format(string, inserts);

  const deleteComment = db.query(sql, (error, result) => {
    if (!error) {
      res.status(200).json({ message: "Commentaire annulé avec succès!" });
    } else {
      return next(new HttpError("Requête en erreur, le commentaire n'a pas pu être supprimé", 500));
    }
  });
};
