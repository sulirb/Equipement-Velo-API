const mongoose = require("mongoose");
const slug = require("mongoose-slug-generator/lib/slug-generator");
const domPurifier = require("dompurify");
const { JSDOM } = require("jsdom");
const htmlPurify = domPurifier(new JSDOM().window);
const stripHtml = require("string-strip-html/dist/string-strip-html.cjs");

mongoose.plugin(slug);

const articlesSchema = mongoose.Schema({
  title: { type: String, required: true },
  file: { type: String, required: true },
  content: { type: String, required: true },
  slug: { type: String, slug: "title", unique: false },
  tag: { type: String },
  createdAt: { type: Date, default: Date.now },
});
articlesSchema.pre("validate", function (next) {
  if (this.content) {
    this.content = htmlPurify.sanitize(this.content);
    this.snippet = stripHtml(this.content.substring(0, 200)).result;
  }

  next();
});

module.exports = mongoose.model("Article", articlesSchema);
