import { type RouteConfig, index, route, layout } from "@react-router/dev/routes";

export default [
  layout("components/layout.tsx", [
    index("routes/home.tsx"),
    route("auth", "routes/auth.tsx"),
    route("dashboard", "routes/dashboard.tsx", [
      index("routes/dashboard.index.tsx"),
      route("profile", "routes/dashboard.profile.tsx"),
      route("settings", "routes/dashboard.settings.tsx"),
      route("articles", "routes/dashboard.articles.tsx"),
      route("write", "routes/dashboard.write.tsx"),
    ]),
    route("articles", "routes/articles.tsx"),
    route("articles/new", "routes/articles.new.tsx"),
    route("articles/:id", "routes/articles.$id.tsx"),
    route("articles/edit/:id", "routes/articles.edit.$id.tsx"),
  ]),
] satisfies RouteConfig;
