
const jwt  = require ("jsonwebtoken"); 
const { secretjwt, refreshjwt } = require('../user/passwords.json');


function adminAuth(req, res, next) {
  const authToken = req.cookies.auth;
  const refreshToken = req.cookies.refreshToken;

  if (!req.session.user || !req.session.user.email) {
      console.log("Not authorized to access this route.");
      return res.redirect("/login");
  }
   
  if (!authToken) {
    console.log("Invalid token.");
    return res.redirect("/login");
  }

  jwt.verify(authToken, secretjwt, (err, decoded) => {
    if (err) {
      if (!refreshToken) {
        res.redirect("/login");
        console.log("No refresh token found");
        return;
      }
      jwt.verify(refreshToken, refreshjwt, (err, decoded) => {
        if (err) {
          res.redirect("/login");
          console.log("Invalid refresh token");
          return;
        } else {
          const newAfToken = req.cookies.auth;
          if (!newAfToken) {
            const newToken = jwt.sign({ email: decoded.email }, secretjwt, { expiresIn: "30s" });
            req.token = newToken;
            res.cookie("authnew", newToken);
            console.log("Access token refreshed");
            next();
          } else {
            jwt.verify(newAfToken, secretjwt, (err) => {
              if (err) {
                const newToken = jwt.sign({ email: decoded.email }, secretjwt, { expiresIn: "30s" });
                req.token = newToken;
                res.cookie("auth", newToken); 
                console.log("Access token refreshed");
                next();
              } else {
              res.cookie("authnew", newAfToken); 
              console.log("Access token refreshed");
              next();
              }
            })
          }
        } 
      });
    } else {
      req.token = authToken;
      req.decoded = decoded;
      console.log("Authorized");
      next();
    }
  });
}

module.exports = adminAuth;
