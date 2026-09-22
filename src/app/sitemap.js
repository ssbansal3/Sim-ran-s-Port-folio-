const SITE_URL = "https://bansalsimran.com";

export default function sitemap() {
  const routes = ["", "/work", "/about", "/resume", "/timeline"];
  const lastModified = new Date();

  return routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.8,
  }));
}
