import express from "express";
import nunjucks from "nunjucks";
import cookie from "cookie";
import { myUsers } from "../src/userDataBase";

const app = express();

nunjucks.configure("views", {
  autoescape: true,
  express: app,
});

app.set("view engine", "njk");

app.use(express.static("public"));

app.get("/", (request, response) => {
  const cookies = cookie.parse(request.get("cookie") || "");
  const cookieType = cookies.myCookie;
  const cookieUsername = cookies.usernameCookie;
  const cookiePassword = cookies.passwordCookie;
  if (cookieUsername === undefined && cookiePassword === undefined) {
    response.render("login");
  } else {
    response.render("home", { cookieType });
  }
});

app.get("/options", (request, response) => {
  const cookies = cookie.parse(request.get("cookie") || "");
  const cookieType = cookies.myCookie;
  console.log(cookieType);
  response.render("options", { cookieType });
});

const formParser = express.urlencoded({ extended: true });

app.post("/handle-form", formParser, (request, response) => {
  const usernameExist = request.body.username;
  const passwordExist = request.body.password;

  console.log(usernameExist);
  console.log(passwordExist);

  if (
    myUsers.some((element) => element.username === usernameExist) &&
    myUsers.some((element) => element.password === passwordExist)
  ) {
    response.set("Set-Cookie", [
      cookie.serialize("usernameCookie", usernameExist, {
        maxAge: 3600,
      }),
      cookie.serialize("passwordCookie", passwordExist, {
        maxAge: 3600,
      }),
    ]);
    response.redirect("/");
  } else {
    response.redirect("/");
  }
});

app.post("/add-cookie", formParser, (request, response) => {
  const appearance = request.body.appearance;
  console.log(appearance);
  response.set(
    "Set-Cookie",
    cookie.serialize("myCookie", appearance, {
      maxAge: 3600,
    }),
  );
  response.redirect("/");
});

app.get("/logout", (request, response) => {
  response.set("Set-Cookie", [
    cookie.serialize("usernameCookie", "", {
      maxAge: 0,
    }),
    cookie.serialize("passwordCookie", "", {
      maxAge: 0,
    }),
  ]);
  response.redirect("/");
});

app.listen(3001, () => {
  console.log("Server started on http://localhost:3001");
});
