export const slugify = (value = "") =>
  value
    .toString()
    .trim()
    .toLowerCase()
    // Replace spaces and underscores with dash
    .replace(/[\s_]+/g, "-")
    // Remove all non-word chars except dashes
    .replace(/[^\w-]+/g, "")
    // Collapse multiple dashes
    .replace(/--+/g, "-")
    // Remove leading/trailing dashes
    .replace(/^-+|-+$/g, "");
