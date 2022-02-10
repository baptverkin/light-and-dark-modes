import express from "express";
import nunjucks from "nunjucks";
import cookie from "cookie";

const app = express();

nunjucks.configure("views", {
  autoescape: true,
  express: app,
});

app.set("view engine", "njk");

app.use(express.static("public"));

app.get("/", (request, response) => {
  const cookies = cookie.parse(request.get("cookie") || "");
  console.log(cookies);
  const cookieType = cookies.myCookie;
  console.log(cookieType);
  let light = "";
  let dark = "";
  if (cookieType === "light") {
    light = "light";
  } else if (cookieType === "dark") {
    dark = "dark";
  }
  response.render("home", { light, dark });
});

app.get("/options", (request, response) => {
  const cookies = cookie.parse(request.get("cookie") || "");
  console.log(cookies);
  const cookieType = cookies.myCookie;
  console.log(cookieType);
  let light = "";
  let dark = "";
  if (cookieType === "light") {
    light = "light";
  } else if (cookieType === "dark") {
    dark = "dark";
  }
  response.render("options", { light, dark });
});

const formParser = express.urlencoded({ extended: true });

app.post("/handle-form", formParser, (request, response) => {
  response.send(JSON.stringify(request.body));
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

app.listen(3001, () => {
  console.log("Server started on http://localhost:3001");
});
