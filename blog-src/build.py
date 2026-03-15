#!/usr/bin/env python3
"""
Blog builder: converts blog-src/posts/*.md -> blog/posts/{slug}/index.html
Also generates blog/index.html (post list) and copies blog.css.
Run from repo root: python blog-src/build.py
"""
import os, re, shutil
from pathlib import Path
from datetime import datetime

try:
    import markdown
except ImportError:
    print("Installing markdown library...")
    os.system("pip install markdown -q")
    import markdown

# ── Paths ────────────────────────────────────────────────────────────────────
ROOT      = Path(__file__).parent.parent
SRC       = ROOT / "blog-src"
POSTS_DIR = SRC / "posts"
OUT_DIR   = ROOT / "blog"
TEMPLATE  = (SRC / "template.html").read_text(encoding="utf-8")
MD        = markdown.Markdown(extensions=["extra", "smarty"])

# ── Helpers ───────────────────────────────────────────────────────────────────
def parse_frontmatter(text):
    """Extract --- frontmatter --- and return (meta_dict, body)."""
    if not text.startswith("---"):
        return {}, text
    parts = text.split("---", 2)
    if len(parts) < 3:
        return {}, text
    meta = {}
    for line in parts[1].strip().splitlines():
        if ":" in line:
            key, _, val = line.partition(":")
            meta[key.strip()] = val.strip()
    return meta, parts[2].strip()

GRID_WRAP = """<div class="container main-content">
    <div class="row">
        <div class="col-sm-10 offset-sm-1 col-md-10 offset-md-1 background-neutral py-4">
            {body}
        </div>
    </div>
</div>"""

def render(page_title, meta_desc, canonical, body):
    wrapped = GRID_WRAP.format(body=body)
    return (TEMPLATE
        .replace("{{PAGE_TITLE}}", page_title)
        .replace("{{META_DESCRIPTION}}", meta_desc)
        .replace("{{CANONICAL}}", canonical)
        .replace("{{BODY}}", wrapped))

def slugify(title):
    s = title.lower()
    s = re.sub(r"[^a-z0-9\s-]", "", s)
    s = re.sub(r"\s+", "-", s.strip())
    return s

def fmt_date(date_str):
    try:
        return datetime.fromisoformat(str(date_str)).strftime("%-d %B %Y")
    except Exception:
        return str(date_str)

# ── Collect posts ─────────────────────────────────────────────────────────────
posts = []
for md_file in sorted(POSTS_DIR.glob("*.md")):
    meta, body = parse_frontmatter(md_file.read_text(encoding="utf-8"))
    slug = md_file.stem
    MD.reset()
    html_body = MD.convert(body)
    posts.append({
        "slug":    slug,
        "title":   meta.get("title", slug),
        "date":    meta.get("date", ""),
        "summary": meta.get("summary", ""),
        "html":    html_body,
    })

# Sort newest first
posts.sort(key=lambda p: p["date"], reverse=True)

# ── Output dir ────────────────────────────────────────────────────────────────
OUT_DIR.mkdir(exist_ok=True)
(OUT_DIR / "posts").mkdir(exist_ok=True)

# ── Generate individual post pages ───────────────────────────────────────────
for post in posts:
    post_dir = OUT_DIR / "posts" / post["slug"]
    post_dir.mkdir(exist_ok=True)

    body_html = f"""
<div class="blog-container">
    <nav class="breadcrumb"><a href="/blog/">← blog</a></nav>
    <article class="post-single">
        <header class="post-header">
            <div class="post-meta">{fmt_date(post['date'])}</div>
            <h1 class="post-title">{post['title']}</h1>
        </header>
        <div class="post-content">
            {post['html']}
        </div>
        <div class="post-footer">
            <a href="/blog/" class="post-back">← wszystkie wpisy</a>
        </div>
    </article>
</div>"""

    page = render(
        page_title    = f"{post['title']} | ogrodnik projektuje",
        meta_desc     = post["summary"] or post["title"],
        canonical     = f"/blog/posts/{post['slug']}/",
        body          = body_html,
    )
    (post_dir / "index.html").write_text(page, encoding="utf-8")
    print(f"  OK posts/{post['slug']}/index.html")

# ── Generate blog index ───────────────────────────────────────────────────────
cards = ""
for post in posts:
    cards += f"""
    <article class="post-card">
        <div class="post-meta">{fmt_date(post['date'])}</div>
        <h2 class="post-card-title"><a href="/blog/posts/{post['slug']}/">{post['title']}</a></h2>
        <p class="post-card-summary">{post['summary']}</p>
        <a href="/blog/posts/{post['slug']}/" class="post-read-more">Czytaj dalej →</a>
    </article>"""

if not cards:
    cards = '<p class="text-muted">Brak wpisów. Wróć wkrótce!</p>'

index_body = f"""
<div class="blog-container">
    <div class="blog-hero">
        <h1>blog ogrodnikprojektuje.pl</h1>
        <p>Rośliny, techniki i sezonowe porady od projektanta z 20-letnim doświadczeniem.</p>
    </div>
    <div class="post-list">{cards}</div>
</div>"""

index_page = render(
    page_title    = "Blog – ogrodnik projektuje",
    meta_desc     = "Porady ogrodnicze, inspiracje i aktualności z pracowni ogrodnikprojektuje.pl",
    canonical     = "/blog/",
    body          = index_body,
)
(OUT_DIR / "index.html").write_text(index_page, encoding="utf-8")
print(f"  OK index.html")
# ── Update sitemap (blog posts only, static URLs untouched) ───────────────────
SITEMAP = ROOT / "sitemap.xml"
sitemap_text = SITEMAP.read_text(encoding="utf-8")

# Strip any previously generated blog post entries
sitemap_text = re.sub(r'\s*<url>\s*<loc>[^<]*/blog/posts/[^<]*</loc>.*?</url>', '', sitemap_text, flags=re.DOTALL)

# Build new blog post entries
blog_urls = ""
for post in posts:
    loc = f"https://www.ogrodnikprojektuje.pl/blog/posts/{post['slug']}/"
    lastmod = str(post["date"]) if post["date"] else datetime.now().strftime("%Y-%m-%d")
    blog_urls += f"\n  <url>\n    <loc>{loc}</loc>\n    <lastmod>{lastmod}</lastmod>\n    <priority>0.7</priority>\n  </url>"

sitemap_text = sitemap_text.replace("</urlset>", f"{blog_urls}\n</urlset>")
SITEMAP.write_text(sitemap_text, encoding="utf-8")
print(f"  OK sitemap.xml (+{len(posts)} blog post URLs)")

print(f"\nDone - {len(posts)} post(s) built to blog/")
