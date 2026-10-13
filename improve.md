# Improvements for charlesxu.io

Review of `dev` at `a05e6c0` on 2026-10-12. Seven reviewers each covered one
area: the Ruby plugins; the Python and shell tooling; JavaScript; templates
and CSS; build, deploy and docs; the built site and its content; and the
status of the two earlier reviews. All of them worked from one frozen copy of
the commit and its production build (`JEKYLL_ENV=production`, PurgeCSS
applied; `check-site.py` passes on it). A separate auditor then re-checked
the claims and the proposed fixes over three rounds, and an editor reviewed
the text.

## Implementation status

The review below describes the original `a05e6c0` snapshot. Completed in the
current working tree:

- **#7:** meaningful alternatives for all 67 previously altless content images;
  `check_site.py` now fails on a missing `alt` inside `<main>`.
- **#8:** one Node process compiles classic scripts with `vm.Script` and event
  handler bodies with `vm.compileFunction`; regression tests cover illegal
  top-level `return` and handler-wrapper escapes.
- **#9:** `make test` measures every in-scope Python script, Ruby plugin and
  site-owned JS file. Python/Ruby gates are per-file 95%; JS gates are 100%,
  with a real-report guard against missing files. Current line and branch
  coverage is 100% throughout. The three Python scripts use snake_case names;
  suites and fixtures are durable source files under `_scripts/tests/`, not
  `/tmp` prototypes. The three #15 plugin regressions were fixed as prerequisites.
  Unrelated built-site assertions remain with their corresponding open issues.
- **D1 clarified:** consistency means sharing the regular post's responsive
  text measure, not imposing a fixed 34rem cap. The initial cap was a regression
  and has been removed. Posts, About, Bookshelf (including its sections),
  Inspirations and wiki share the original post breakpoint widths, then grow
  continuously above 1500px without a fixed ceiling. Figures grow with the text;
  image `sizes` and regression tests use the corresponding responsive bands.

Validation after the D1 correction: `make check` passes; the browser layout
check passes 260 page/viewport combinations, resizing each document without
reloading and including rendered MathJax. The reading column is 710px at
1500px, 889px at 1920px and 1159px at 2552px, shared across the reading layouts.
A broader overflow sweep passes 450 combinations across 90 HTML pages
(excluding the redirect-only thesis page). Narrow-phone technical terms wrap
inside the reading column. A separate auditor
verified actual paragraph reflow, forward/reverse resizing, figure/share
clearance and matching image declarations; no findings remain. See README "Reading layout" and "Tests and coverage" for
the contracts and repeatable checks.

> **Publication guard:** `improve.md` is now in `_config.yml`'s `exclude:`;
> the stale `improvement-ideas.md` and `sev.md` entries were removed.

**Severity.** Critical: broken or exploitable now. High: can publish a wrong
or leaky site, or harms readers or the domain. Medium: a real defect that
readers hit, or a safety net that silently doesn't work. Low: a latent bug,
a small reader papercut or maintenance cost. Nit: polish.

**Effort.** S: up to a couple of hours. M: up to a day. L: more.
**Confidence.** Verified: reproduced or measured. Likely: strong evidence,
not reproduced.
**Sources.** `earlier #n` is item n of `improvement-ideas.md` (2026-10-09),
and `earlier, smaller items` is its "Smaller items" list. `S1`–`S7` are the
items of the PageSpeed review `sev.md`, and `sev.md follow-up` is its closing
note. Both files are deleted; read them with `git show
270dc60^:improvement-ideas.md` and `git show a05e6c0^:sev.md`.

Line numbers refer to `a05e6c0`. Fixes shift them and move files (#21 moves
`screen.css`; the test plan renames `check-site.py`, `optimize-images.py` and
`make-social-cards.py` to snake_case), so find code by the quoted text.

## Summary

There's nothing Critical, and the code is in good shape: the image pipeline
and plugins held up under fuzzing (apart from #15's unterminated-quote case)
and layout measurement, and mobile Lighthouse performance is 96–100 on the
four page types tested (see "Already good"). What's left:

- **Deploy:** `make push` publishes whatever is in `_site`, unbuilt and
  unchecked (#1).
- **Outside the repo:** no email authentication and no GitHub Pages domain
  verification (#2); the README's Cloudflare cache rules were never applied
  (#14).
- **Content:** Kubernetes, Terraform, Pulumi and Docker snippets that fail
  when pasted, and HPA advice that makes scaling slower (#3); dated advice
  with no visible post date (#4).
- **Readers:** the search dialog ignores Escape and never takes focus (#5),
  the four newest posts never appear under "New Posts" (#6), 67 of 82 images
  have no alt text (#7), the first search freezes a phone for close to a
  second (#10), and cards show boilerplate instead of descriptions (#11).
- **Safety net and tests:** `make check` passes a top-level `return` that
  breaks a script in browsers (#8). Coverage is 34% for Python and 0% for
  Ruby, and the JS coverage report counts no files at all (#9). The test
  plan's prototype suites reach 100%.
- **Tooling:** no target builds without a TTY, so the build command exists in
  four drifting copies (#12), and there's no CI (#13).
- **Docs:** the README has no deploy or preview steps (#34), and the JS files
  and plugin entry points lack header comments (#38).
- **Simplifications:** #8, #12, #21, #25 and #31–#33 mostly remove code or
  copies, and #1 reuses #12's targets.

Seven questions need your answer before the related work starts (D1–D7,
after the ranked list). The biggest is D1: the ~70-character reading column
you chose was never implemented.

## Ranked list

| # | Severity | Item | Area | Effort |
|---|---|---|---|---|
| 1 | High | `make push` publishes an unbuilt, unchecked `_site` | Deploy | S |
| 2 | High | No SPF, DKIM, DMARC or GitHub Pages domain verification | Security, outside the repo | S |
| 3 | High | Snippets that fail when pasted; HPA advice that slows scaling | Content | S |
| 4 | Medium | Dated technical advice; post age is hidden | Content | S–M |
| 5 | Medium | Search dialog: no Escape, no focus, no usable name | Accessibility | S |
| 6 | Medium | The newest posts are missing from "New Posts" | Information architecture | S |
| 7 | Medium | 67 of 82 content images have no `alt` | Accessibility, SEO | M |
| 8 | Medium | The JS syntax check accepts a top-level `return` | Safety net | S |
| 9 | Medium | Coverage is far below 95%; the JS report is empty | Tests | M–L |
| 10 | Medium | The first search blocks a phone for close to a second | Performance | S |
| 11 | Medium | Cards show boilerplate excerpts, not descriptions | Content | S |
| 12 | Medium | No non-interactive build target; four drifting build commands | Tooling | S |
| 13 | Medium | No CI | Tooling | S–M |
| 14 | Medium | Cloudflare cache rules aren't applied | Performance, outside the repo | S |
| 15 | Low | Image plugin: SVG covers, hash-form `image:` and the tag scanner | Latent bug | S |
| 16 | Low | Content SVGs get no `loading`, `decoding` or `height` | Performance | S |
| 17 | Low | MathJax floats on `@3` with no SRI | Supply chain | S |
| 18 | Low | Without JS the phone menu is dead and `/thesis` is blank | Robustness | S |
| 19 | Low | Landmarks, headings, pagination and card links | Accessibility | S |
| 20 | Low | Internal links without a trailing slash cost a 301 | Performance, SEO | S |
| 21 | Low | Deploys include 3.8 MB of unlinked files | Hygiene | S |
| 22 | Low | The newsletter block shifts the page on phones | Layout | S |
| 23 | Low | Selecting across code blocks copies line numbers | Content | S |
| 24 | Low | Smaller `check-site.py` gaps and crashes | Safety net | S |
| 25 | Low | `make-social-cards.py` ignores transparency, EXIF and ICC | Tooling | S |
| 26 | Low | Per-post figure scripts: a check that always fails; data in `/tmp` | Tooling | S |
| 27 | Low | Typos and rendering slips | Content | S |
| 28 | Low | Six dead external links | Content | S |
| 29 | Low | Orphan category archives; empty pages in the sitemap | SEO, information architecture | S–M |
| 30 | Low | Post share images lack `og:image` dimensions | SEO | S |
| 31 | Low | Dead template, config and repo files | Maintenance | S |
| 32 | Low | Dead, overridden or invalid CSS | Maintenance | S |
| 33 | Low | Hand-copied nav, wiki panel and TOC markup | Simplification | S |
| 34 | Low | README: no deploy or preview steps; drift from the code | Docs | S |
| 35 | Low | Dev-tooling papercuts | Tooling | S |
| 36 | Low | TLS 1.0/1.1 accepted; no HSTS or security headers | Security, outside the repo | S |
| 37 | Low | Deploy commits carry a work email | Privacy | S |
| 38 | Low | JS files and plugin entry points lack header comments | Docs | S |
| 39 | Low | The tp post's diagrams are unreadable on phones | Content | S |

Next come the decisions and a suggested order, then the items by severity,
nits, the test plan, the status of earlier reviews, what's already good, and
measurements.

---

## Decisions for you

These depend on preferences, so they aren't ranked as defects.

- **D1. The ~70-character reading column isn't in the code.** You picked
  ~70 characters per line (34rem) for posts and About, but no
  `.reading-width` rule exists on any branch. Measured longest lines: posts
  run 84 characters at 1024 px and 100 at 1280–1499 px; About and wiki pages
  90. The nested `.container` in `post.html:11` also makes the post column
  116 px *narrower* when the window grows from 1499 to 1500 px (80% of 80%).
  Implementing it means dropping the inner container, capping the text at
  34rem, and re-deriving the `.figure-wide` margins and the `article` and
  `figure` bands in `responsive_images.rb` (M). Do you still want it?
- **D2. GA4.** It's about 165 KB transferred on every page (60–70% of a
  wiki page's bytes), sets `_ga` cookies with no Consent Mode default, and
  there's no privacy page. Cloudflare Web Analytics already counts pageviews
  and Web Vitals. Keep it (add consent defaults and a `/privacy` page), or
  drop it (#1's new `push` no longer checks for it)?
- **D3. Code-block line numbers.** Turn them off (`line_numbers: false`, plus
  `{% highlight x linenos %}` on the few long listings), or keep them with
  #23's `user-select` fix?
- **D4. Categories.** There are 19 overlapping categories, four with one
  post. Merge them to about 7? And which is the canonical listing,
  `/categories` or the `/category/*` archives (#29)?
- **D5. Unlinked files.** Are `race/`, `circle-cropped*` or the 2021 talk PDF
  linked from outside the site? If not, delete them; if so, list the images
  in `UNPROCESSED` so they stop getting variants. The talk could be linked
  from About.
- **D6. Search syntax.** The lunr 2.3.9 upgrade (#10) makes a leading `-`
  exclude a term and `+` require one, and a stray trailing `-` then shows "no
  results". Fine, or strip `+` and `-` before searching?
- **D7. Cross-links.** Only three posts link to another post, and the ML
  posts don't link to each other (earlier #25). Add "related posts" or
  `series:` links?

Decided earlier and not reopened: the theme's original greys over WCAG
contrast (earlier #5, S2), the looping About tagline (it stops under reduced
motion), the uncropped 3:2 letterboxed card covers, `.figure-wide` figures,
and a second `fetchpriority` cover (S6, tested with no gain).

## Suggested order

Give each group to one agent, and run the steps in this order, rebasing each
on the last. Don't renumber items: other sections cite them by number.

1. **Now:** exclude this file (note at the top). Copy the benchmark data
   (#26) and the prototype test suites (see the test plan) out of `/tmp`
   before macOS clears them.
2. **You, any time:** #2, #14, #36 and #37. Answer D1 before step 5 (it
   changes the `sizes` strings #9 pins), and D3–D6 before the step-6 items
   that need them.
3. **The rename, in one commit:** the test plan's rename of the three Python
   scripts. It touches files that most groups edit, and #1 and #25 use the
   new names.
4. **Build and deploy** (Makefile, `check.sh`, AGENTS.md, README): #12, then
   #1, then #13 (it needs #12's `--user`); #34, #35.
5. **Tests and checkers** (`_scripts/`, `_plugins/`): #9 with #15 (three of
   #9's Ruby tests fail until #15's fixes land; `make test` uses #12's
   `DOCKER_RUN`), then #8 and #24. Add every new site assertion (#7, #20,
   #24's slashless-link error, #27 and the test plan's list) as a warning
   when today's site fails it, so `make check` keeps passing.
6. **Then in parallel:**
   - **Search** (`lunrsearchengine.js`, `search-lunr.html`): #5, then #10
     (after #9's search tests and D6).
   - **Image plugin and scripts** (`_plugins/`, `_scripts/`): #16, then #30;
     #25, #26.
   - **Templates** (`_layouts/`, `_includes/`, `index.html`): #6, #11, #17,
     #18, #19 with #33, #20's template links, #29 (after D4), #31.
   - **CSS** (`assets/css/`, `_sass/`): #21 (its images after D5), then #22,
     #23 (after D3) and #32.
   - **Content** (`_posts/`, `wiki/`, `_pages/`): #3, #4, #7's alt text,
     #27, #28, #39, #20's content links.

   Each group adds tests for the code it adds, or the coverage gates (100%
   for JS, 95% for Python and Ruby) fail: #16 untested would drop
   `responsive_images.rb` to about 93%.
7. **Last:** turn step 5's warnings into errors once step 6's fixes land,
   and add #38's comments now that #9 has moved the search loader and #15
   has changed the plugin.

Some files still span the parallel groups, so expect to rebase on them:
`main.scss` and `screen.css` (#19, #21, #31–#33), post front matter (#3, #4,
#6, #7, #39), `_pages/about.md` and `inspirations.md` (#7, #18, #27, #28,
#33), AGENTS.md (#21, #31, #33), `_config.yml` (#23 if D3 turns line numbers
off, #31), and `optimize_images.py`, renamed in step 3 (#30, and #6's
optional 720 px width). #21, #30 and the 720 px width also change
`_data/images.yml` and `assets/images/`; after rebasing, re-run `make images`
instead of merging the YAML by hand.

---

## High

### 1. `make push` publishes an unbuilt, unchecked `_site`

Deploy · S · Verified · earlier #3

`push_commit_to_github_pages_repo` (`Makefile:105-112`) never builds. Its
only guard (`:107`) is `test -s _site/CNAME && grep -q googletagmanager
_site/index.html`. So it publishes:

- **A stale or foreign `_site`:** one built on another branch, before the
  last edit, or by `jekyll serve`. `make check` builds into a temporary
  directory (`_scripts/check.sh:6`), so a passing check says nothing about
  the files that deploy.
- **Uncommitted, untracked and git-ignored files:** Jekyll doesn't read
  `.gitignore`. It publishes every file it doesn't skip itself (names
  starting with `_`, `.` or `#`, names ending in `~`, and defaults such as
  `Gemfile` and `node_modules`) unless `exclude:` lists it. That's how the
  git-ignored `cloudflare_purge.token` sat in the public deploy repo from
  2022-05-15 to 2026-10-09, and how this file would ship.
- **An unpurged build:** if `purge-css` fails after `make docker.build`'s
  Jekyll step, `_site` keeps the 188,448 B `main.css` instead of the 34,811 B
  purged one, and the guard passes it.

Also:

- `git commit -m "release"` exits 1 when nothing is staged, so the `&&` chain
  never reaches `git push`, and a failed push can't be retried by rerunning
  `make push`.
- No deploy commit records the source commit; 76 of the deploy repo's 79
  commits are titled "release".
- The guard depends on the analytics vendor: dropping GA4 (D2) would block
  every deploy.
- There's no `.nojekyll`, so GitHub Pages runs its own Jekyll 3 over the
  built output on every deploy, and would drop any future `_`-prefixed asset.
  Adding it to the deploy repo by hand doesn't work: `rsync --delete` removes
  it.

**Fix.** Build and check inside the target, refuse a dirty tree and
secret-looking files, and record the source commit. With #12's `build`
target:

```make
SECRET_NAMES = -name '*.token' -o -name '*.pem' -o -name '*.key' -o -name '.env*'

.PHONY: push
push:
	@test -z "$$(git status --porcelain)" || { echo "push: commit or stash first" >&2; exit 1; }
	$(MAKE) check
	$(MAKE) build
	$(IMAGES_PYTHON) _scripts/check_site.py _site
	@files=$$(find _site \( $(SECRET_NAMES) \)); \
		test -z "$$files" || { echo "push: secret-like files in _site: $$files" >&2; exit 1; }
	rsync -a --delete --exclude=/.git _site/ $(GH_PAGES_REPO)/
	cd $(GH_PAGES_REPO) && git add -A \
		&& git commit -m "release $(shell git rev-parse --short HEAD)" && git push
```

- `--porcelain` counts untracked files on purpose, because Jekyll would
  publish them. It doesn't list git-ignored files, which Jekyll publishes
  too, hence the `find`. Keep secrets in `exclude:` as well; deploying from
  CI's fresh checkout (#13) closes the gap completely.
- Each build stamps its time into every page's `?v=` and the feed, so every
  push changes about 92 files and always commits (tested twice against a
  scratch deploy repo). That's also what makes a failed push retryable, so
  there's no "nothing changed" guard. `$(shell git rev-parse …)` runs in the
  source repo, before the `cd`.
- `check_site.py` is the test plan's new name for `check-site.py`.
- Delete the GA guard and the `push_commit_to_github_pages_repo` alias. Add
  an empty `.nojekyll` and `include: ["_pages", ".nojekyll"]`. Say in
  AGENTS.md that push builds and checks first.

### 2. No SPF, DKIM, DMARC or GitHub Pages domain verification

Security, outside the repo · S · Verified with `dig` · earlier #8

- MX points at Google Workspace, but `dig TXT charlesxu.io` returns only two
  `google-site-verification` records, and `_dmarc.charlesxu.io` and
  `google._domainkey.charlesxu.io` don't exist. Anyone can send convincing
  mail as the address on `/about`, and Gmail's and Yahoo's sender rules
  penalize the domain's real mail.
- `_github-pages-challenge-cxuu.charlesxu.io` doesn't exist, so the domain
  isn't verified on GitHub. If the deploy repo ever loses `CNAME` (it's
  mirrored with `rsync --delete`) or Pages is turned off while DNS still
  points at GitHub, another account can claim `charlesxu.io`.

**Fix.** About 30 minutes in the dashboards:

- SPF: `v=spf1 include:_spf.google.com ~all`.
- DKIM: generate the key in Workspace and publish `google._domainkey`.
- DMARC: start with `v=DMARC1; p=none; rua=mailto:<you>`, then tighten.
- Verify the domain under your **profile's** Settings → Pages (not the
  repository's), and add its `_github-pages-challenge-cxuu` TXT record.

### 3. Snippets that fail when pasted; HPA advice that slows scaling

Content · S · Verified; Pulumi row read by hand (Likely) · earlier #11, #24

| Where | Problem |
|---|---|
| `_posts/2023-10-22-scaling-istio.md:182-209` | The text says the default scale-up stabilization window is 300 s and should be cut to 10 s. The default is **0**, so following it makes scaling slower, with no error. The HPA also uses `autoscaling/v2beta2`, not served since Kubernetes 1.26, and `stabilizationWindowSeconds: 10s` / `300s`, but the field is an integer. |
| `_posts/2019-3-10-configmap.md:29-55`, `:61-90` | Both Deployments are invalid YAML (`volumes:` is indented under `containers`; PyYAML: `while parsing a block collection … line 16, column 9`) and use `apiVersion: app/v1` (should be `apps/v1`). The relative `etc/myapp/config.yaml` reaches the `/etc/myapp` mount only if the working directory is `/`. |
| `_posts/2019-12-29-k8s-ha.md:82,108,114` | A `policy/v1beta1` PodDisruptionBudget (removed in 1.25), an `extensions/v1beta1` Deployment as the VPA target (removed in 1.16), and `autoscaling.k8s.io/v1beta2`, which the upstream VPA CRD stopped serving in VPA 1.3.0. |
| `_posts/2019-1-21-docker_multi_stage.md:19,35-37,49-51` | `apt-get install` without `-y` aborts in `docker build`; the file is downloaded to `/tmp/dep.tgz`, then `tar xzf /tmp/dep.zip` runs; `debian:wheezy`'s repositories are archived. |
| `wiki/infra-as-code/terraform.md:20` | `"${filesha256(${path.module}/output.tf)}"` fails `terraform fmt`; `filesha256("${path.module}/output.tf")` passes. |
| `wiki/infra-as-code/pulumi.md:24-90` | The Go doesn't compile: no `package`, missing imports, `arnPrefix` and `onGovCloud` undeclared, `o.Ctx` doesn't exist, an unused `policy, err`, and `runFn` doesn't return. |

Readers who paste these get an error, or, with the HPA, slower scaling and no
error. These are the pages people find through search and copy from.

**Fix.** Correct each snippet in place; for the HPA, drop `scaleUp` or say
"keep 0". Mark a deliberate sketch with a first-line comment (`# sketch` in
YAML, `// sketch, doesn't compile` in Go). Add `last_modified_at` to each
post you change. To catch the next one, add a step next to codespell in
`check.sh` that parses every fenced `yaml` block with `yaml.safe_load_all`,
skipping marked sketches, and greps for removed API versions.
`scaling-istio.md:86-124` needs the marker: YAML reads its `...` placeholder
as a document end.

---

## Medium

### 4. Dated technical advice; post age is hidden

Content · S–M · Verified unless noted · earlier #11, #12, #24

- `wiki/go/production.md:25-45` recommends `recover()` in `main` so the
  server doesn't crash. `recover` only works in the panicking goroutine;
  reproduced: a panic in a `go func()` still kills the process. `net/http`
  already recovers handler panics. Recover at the top of each goroutine or in
  middleware.
- `wiki/kubernetes/commands.md:67-71` runs a hand-built debug Pod (now
  `kubectl debug`, GA in 1.25), and `:141-146` uses the `kubectl roll` plugin
  (now `kubectl rollout restart`).
- `2020-03-20-gke-scaling.md:3,53-58`: "L4 ILB Tops at 250 Nodes". GKE
  subsetting lifts that limit. Add a dated note.
- `2019-4-7-2s-comp.md:3`: "Layer 2/3 Checksum". Ethernet uses CRC-32; the
  ones'-complement checksum is IP, TCP and UDP, so "Layer 3/4".
- `2019-1-21-docker_multi_stage.md:62` (Likely): the SSH-key advice is
  superseded by BuildKit's `RUN --mount=type=ssh` (stable since Dockerfile
  syntax 1.2, 2020), which keeps the key out of every layer.
- The date renders only after the article (`_layouts/post.html:58-65`), and
  no post sets `last_modified_at`, so nothing tells readers a 2019 post is
  from 2019.

**Fix.** Short "Update (2026-10)" notes and one-line corrections, and move
the date (plus "Updated", when set) under the `<h1>`.

### 5. Search dialog: no Escape, no focus, no usable name

Accessibility · S · Verified in headless Chrome · earlier #23

`assets/js/lunrsearchengine.js:32-75`:

- Escape and clicks outside the dialog do nothing. `mediumish.js:27`
  deliberately skips Escape while the dialog is open, and nothing else
  handles it.
- Focus stays in the input, so screen readers never hear that a dialog
  opened, and Tab goes through the dialog's buttons and results and then on
  into the page behind.
- `aria-labelledby="resultsmodal"` (`:37`) points at the dialog itself, so
  its name is the dialog's entire text ("Search results for 'git' Close Git
  as Version Vector 2016/12/22 - …").
- An empty or all-space query opens the dialog anyway (`if(term)` at `:38`
  lets `"   "` through).
- Leftovers: two `data-dismiss="modal"` (Bootstrap JS is gone), `return
  false` (`:67`), and the placeholder `<ul>` in `_includes/search-lunr.html:7`.

**Fix** (prototyped and checked at 390 and 1280 px):

- Trim the query and ignore an empty one.
- Put `<h5 class="modal-title" id="lunrsearchtitle">` in the template and
  give the dialog `aria-labelledby="lunrsearchtitle"`; then `id="modtit"` and
  the `createElement` code at `:39-43` can go.
- Focus the dialog after rendering.
- Add one `closeResults()` that hides the dialog, removes `modal-open` and
  returns focus to the input. Call it on a click on the overlay
  (`event.target.id === 'resultsmodal'`) and on Escape, with
  `stopPropagation()`: the dialog sits inside the nav, so without it
  `mediumish.js`'s handler would see `modal-open` already cleared and close
  the menu too.
- Add `role="search"` to the form and `type="search"` to the input.
- Delete the leftovers.

Don't add `aria-modal="true"` without a Tab loop: it promises a trap the page
doesn't have. A native `<dialog>` with `showModal()` gives the trap, an inert
background and focus return for free, but it replaces the Bootstrap modal
markup (M).

### 6. The newest posts are missing from "New Posts"

Information architecture · S · Verified · earlier #1, #27

All 12 `featured: true` posts also have `hidden: true`, and
`index.html:17-26` lists every one under "Popular". jekyll-paginate skips
hidden posts, so "New Posts" on `/` starts at `/lean-startup/` (January
2024). The four 2025–26 ML posts appear on none of `/page2/` to `/page6/`,
and phone readers scroll through 12 large cards first. Mobile LCP on `/` is
still 2.7 s (Lighthouse, median of 3), on the first featured cover, so S1's
2.5 s target isn't met.

**Fix.**

- Drop `hidden: true` from the 12 posts; a post may appear in both sections.
- Replace the `for`/`if` at `index.html:17-26` with
  `{% assign featured = site.posts | where: "featured", true %}` and
  `{% for post in featured limit: 4 %}` (tested: the build renders 4 cards).
- Call the strip "Featured" or "Start here", since it isn't traffic data.
- Then re-measure LCP. If it's still over 2.5 s, consider a 720 px variant:
  at 412 px and 1.75× DPR phones pick the 960 px file, and Lighthouse
  estimates 158 KiB of savings on `/`. Adding a width to `WIDTHS`
  (`optimize-images.py:25`) re-encodes every image, so measure first.

### 7. 67 of 82 content images have no `alt`

Accessibility, SEO · M · Verified · earlier #10

The diagrams carry these posts' arguments, and screen readers announce file
names instead. The grey-palette decision doesn't cover this.

- By post: sys-design 8, kip 6, shell 6, blue-green 5, rsm 5, istio 4,
  k8s-net 4, microservices 4, mq 4, quorum 4, git2 3, pagination 3, session 3,
  source-ip-autoscale 2, speculative-decoding 2, git, jwt and multi-repo 1
  each, and the About headshot (`_pages/about.md:30`).
- The headshot is the only reason About scores 92 on Lighthouse SEO; every
  other page tested scores 100.

**Fix.** Write the alt text, starting with the headshot (`alt="Charles
Xu"`); use `alt=""` only for decorative images. Then have `check-site.py`
warn on an `<img>` without `alt`, and fail once the backlog is done.

### 8. The JS syntax check accepts a top-level `return`

Safety net · S · Verified end to end

`check-site.py:126` runs `node --check -`, which compiles stdin as a
CommonJS module. Node wraps modules in a function, so a top-level `return` is
legal there; a browser compiles a classic script, rejects it ("Illegal return
statement") and skips the whole script. In a copy, an inline `<script>` that
begins `if (!document.body) return;` and the same line appended to
`about.js` both shipped and passed `make check`. The build doesn't parse JS
(`compress_javascript: false`), so this check is the only guard. An early
`return` is easy to write in a new inline script or after unwrapping one of
the IIFEs (`about.js:5` already has `if (!span) return;` inside its wrapper).

**Fix.** Compile every script as a classic script with `vm.Script` in one
Node process. It's shorter, and the check drops from about 1 s to 0.4 s
because Node starts once:

```python
# Compile each [name, source] pair as a classic browser script. `node --check`
# compiles a CommonJS module, which allows a top-level `return`.
COMPILE_SCRIPTS = """
const vm = require("vm");
for (const [name, source] of JSON.parse(require("fs").readFileSync(0, "utf8"))) {
    try { new vm.Script(source, {filename: name}); }
    catch (error) { console.log(`${name}: ${error.name}: ${error.message}`); }
}
"""
```

The same process can compile the 135 share-link `onclick` handlers with
`vm.compileFunction(body, ["event"])`, which, unlike wrapping the body in
`(function (event) {…})`, can't be escaped by the body. Add a `return` case
to `test_check_site.py`, and update AGENTS.md ("`make check` catches it with
`node --check`") and the 0.1 s comment at `check-site.py:83`.

### 9. Coverage is far below 95%; the JS report is empty

Tests · M–L · Verified

Python is at 34%, Ruby and the search engine at 0%, and the JS report counts
no files, so no 95% gate can work yet.

| Code | Lines | Branches | Tests |
|---|---|---|---|
| `_scripts/check-site.py` | 98% | 95% | 1 |
| `_scripts/optimize-images.py` | 0% (0/206) | 0% | 0 |
| `_scripts/make-social-cards.py` | 0% | 0% | 0 |
| `assets/js/mediumish.js`, `about.js` | unmeasured; 100% once fixed | 100% | 11 |
| `assets/js/lunrsearchengine.js` | 0% | 0% | 0 |
| Loader in `_includes/search-lunr.html` | 0% | 0% | 0 |
| `_plugins/*.rb` (4 files, 375 lines) | 0% | 0% | 0 |

- `node --test --experimental-test-coverage` reports "all files 100%" over an
  empty table. The tests run scripts through `vm.runInNewContext` without a
  `filename`, and Node's coverage drops scripts without an absolute path or
  `file:` URL, so a `--test-coverage-lines=95` gate would pass no matter what
  the tests do.
- The untested code is the riskiest code: `optimize-images.py` is the only
  tool that writes and deletes repo files, and the plugins rewrite every page.

**Fix.** Follow "Test plan for 95% coverage" below. Its prototype suites
reach 100% line and branch coverage on every in-scope file and run in a few
seconds, and three of their Ruby tests fail at `a05e6c0`: the SVG cover, the
hash-form `image:` and the tag scanner in #15.

### 10. The first search blocks a phone for close to a second

Performance · S (M with a prebuilt index) · Verified · earlier, smaller items

Focusing the search box loads `lunr.js` and then the 302 KB engine in series,
and builds the index on the main thread while the user is typing. In Chrome
with 4× CPU throttling on `/git/`, the longest task, measured on two
machines, was:

| Build | Longest task |
|---|---|
| Today: lunr 2.1.5 (2017), index built in the browser | 803–941 ms |
| lunr 2.3.9 `lunr.min.js`, index built in the browser | 251–266 ms |
| lunr 2.3.9 with a prebuilt index | no task over 50 ms |

`lunr.min.js` 2.3.9 is also 7.6 KB brotli instead of 18.4 KB. It's the final
release, MIT and ES5, and the custom separator, trimmer and
`QueryParseError` catch keep working (identical results on 16 test queries).
Two behaviors change: a leading `-` or `+` now excludes or requires a term
(D6), and a blank or all-space query matches every document.

**Fix.** Land #5's trim first, then swap in `lunr.min.js` 2.3.9 (S).
Prebuilding the index in a Node step next to `purge-css` removes the long
task (M); do the swap first and decide whether it's still worth it.

### 11. Cards show boilerplate excerpts, not descriptions

Content · S · Verified · earlier #6

`_includes/postbox.html:15` and `featuredbox.html:25` print `post.excerpt`,
though all 45 posts have a hand-written 145–158-character `description`.
Five posts open with boilerplate, which every listing repeats: "Disclaimer:
Opinions are my own…" (5 cards), "Summary To achieve…" (7), "Before
Fundraise:…" (5), "Make sure to check out the previous post…" (3) and "This
post explains…" (3), counting the home page, pagination, archives and
`/categories`.

**Fix.** `{{ post.description | default: post.excerpt | strip_html | truncatewords: 30 }}`
in both includes. Use 30 words in `featuredbox.html` too (it has 25): three
descriptions run 26–27 words.

### 12. No non-interactive build target; four drifting build commands

Tooling · S · Verified · earlier #21

On its own this is maintenance cost; it's ranked Medium because #1 and #13
build on it.

- `make build`, `watch` and `watch-mobile` (`Makefile:1-13`) call the host's
  `bundle`, which can't run this lockfile.
- `make docker.build` fails without a TTY (`DOCKER_OPTS` has `-it`, `:24`)
  and while `docker.watch` holds port 4000, which a build doesn't need.
- So the same `docker run … jekyll build` line lives in AGENTS.md:11-14,
  README.md:143-146 and `check.sh:12-15`, and `docker.build` is a fourth
  variant. They've drifted: `docker.build` writes `_site` and
  `.jekyll-cache` with `--trace`; the others use `-d /out
  --disable-disk-cache`. `make build SITE_DIR=x` builds `_site` but purges
  `x`.
- Nothing builds the `cxu-jekyll-3` image, so a fresh clone's `make check`
  fails with `pull access denied`.

**Fix.** One parameterized `build` and one `serve`, both in Docker:

```make
DOCKER_RUN = docker run --rm --user "$$(id -u):$$(id -g)" -v "$(CURDIR):/jekyll"
SERVE_HOST ?= 127.0.0.1

.PHONY: build
build: docker.devbox # production build plus PurgeCSS into SITE_DIR
	mkdir -p $(SITE_DIR)
	$(DOCKER_RUN) -v "$(abspath $(SITE_DIR)):/out" -e JEKYLL_ENV=production $(DEVTOOL_IMG) \
		bundle exec jekyll build --disable-disk-cache -d /out
	$(MAKE) purge-css SITE_DIR=$(SITE_DIR)

.PHONY: serve
serve: docker.devbox # SERVE_HOST=0.0.0.0 to test from a phone
	$(DOCKER_RUN) -it -p $(SERVE_HOST):4000:4000 $(DEVTOOL_IMG) \
		bundle exec jekyll serve --watch --host 0.0.0.0
```

Delete `watch`, `watch-mobile`, `docker.watch` and `docker.build`; make
`check` depend on `docker.devbox`; have `check.sh` call `make build
SITE_DIR="$site"`; and replace the copied commands in AGENTS.md and the
README with `make build SITE_DIR=/tmp/site`. The `build` target was tested
end to end with `--user` on Docker Desktop (output is user-owned), and Linux
needs it (#13). `-e LANG=C.UTF-8` can go everywhere: the Ruby image already
sets it.

### 13. No CI

Tooling · S (check), M (deploy) · Verified · earlier #19

Nothing runs `make check` unless someone remembers. It takes 43–52 s
locally, mostly `optimize-images.py --check` (see Measurements).

**Fix.** Add a check workflow; a deploy job is optional.

- **Prerequisite:** on Linux, the container's root writes root-owned files
  into the bind mount, so `purge-css` can't write `main.css.purged.css` and
  `check.sh`'s cleanup trap can't delete the tree (mechanism reproduced in
  Docker Desktop's VM). #12's `--user` fixes it.
- **Check workflow** (`.github/workflows/check.yml`): on push to `dev` and on
  pull requests, `actions/checkout`, `setup-node` with the host's Node (26;
  the test plan's coverage thresholds need at least 22.8), `setup-python`
  (3.12), `make docker.devbox`, `make check`, with `permissions: contents:
  read`.
- **Optional deploy job:** check out the source and `cxuu/cxuu.github.io`
  side by side (a `deploy/` inside the source checkout would dirty the tree
  and be published), commit as `github-actions[bot]` with a deploy key, and
  run `make -C src push GH_PAGES_REPO=../deploy`. A fresh checkout has no
  git-ignored files, which closes #1's gap, and the bot identity fixes #37.

### 14. Cloudflare cache rules aren't applied

Performance, outside the repo · S · Verified with `curl` · earlier #15, S4

`asset_urls.rb` versions CSS and JS so they can be cached for a year, but
live `/`, `main.css?v=…`, images, JS and fonts all still send
`cache-control: max-age=14400`. Repeat visitors revalidate everything every
4 hours, and new HTML can stay stale for up to 4 hours after a deploy.

**Fix.** Apply the rules in README "Cloudflare caching" and run its `curl`
checks.

---

## Low

### 15. Image plugin: SVG covers, hash-form `image:` and the tag scanner

Latent bug · S · Verified on copies · earlier #27

- **An SVG cover fails the production build with the wrong cause.**
  `missing_covers` (`_plugins/responsive_images.rb:203-207`) doesn't filter
  with `RASTER`, unlike `missing_content_images` (`:217`). A post with
  `cover_image: /assets/images/x/cover.svg` fails with "either `make images`
  wasn't run or the path doesn't point at a file under assets/images", though
  `cover-image.html:15-16` already handles covers without a manifest entry.
  Fix: `[path, post.relative_path] if path&.match?(RASTER) && !manifest(site).key?(path)`.
- **A hash-form post `image:` ships a broken cover.** `local_path`
  (`:239-240`) returns nil for anything but a String, so a post with `image:
  {path: …, width: …, height: …, alt: …}` builds and renders
  `src="/%7B%22path%22%20=%3E…"` on the post, home and archive pages. Only
  `check-site.py` notices. Fix: `src = src["path"] if src.is_a?(Hash)` at the
  top of `local_path` (tested: the cover renders with its srcset), and allow
  the hash on posts in AGENTS.md; it gives posts `og:image:alt`.
- **The tag scanner misreads an unterminated quoted value.** `TAG_REST`'s
  comment (`:85-89`) says unterminated constructs run to the end of input,
  but an unterminated quoted attribute value doesn't: in `<p title="oops><img
  src=/assets/images/a.png>`, HTML puts the `<img>` inside the attribute,
  while the scanner rewrites it. A differential fuzz against Nokogiri's HTML5
  parser disagreed on 80–87 of 20,000 random documents, all from this case,
  and on none with the fix. No real page hits it. Fix: replace the two quoted
  branches with `"[^"]*+(?:"|\z)|'[^']*+(?:'|\z)`.
- **The missing-image error misleads for variants.** `<img
  src="…/cover-960.webp">`, easy to copy out of built HTML, fails with the
  same message. Fix: add "or it names a generated `-<width>.webp` variant" to
  `reason` (`:138`).

### 16. Content SVGs get no `loading`, `decoding` or `height`

Performance · S · Verified · earlier #27

`RASTER` (`responsive_images.rb:101`) excludes `.svg`, and only manifest
entries are enhanced. The 15 SVG `<img>`s in the tp post
(`/tp-cp-sp-ep-dp-pp/`; `width="900"`, each with a `viewBox`) load eagerly
with no reserved height.

**Fix.** In `rewrite_tag`, give local SVGs `loading="lazy"` and
`decoding="async"`, and when the author set a px `width`, read the `viewBox`
from `site.in_source_dir(path)` to set the height (about 10 lines).

### 17. MathJax floats on `@3` with no SRI

Supply chain · S · Verified · earlier #26

`_layouts/default.html:52-54` loads `mathjax@3/es5/tex-mml-chtml.js` with no
`integrity`. `@3` resolves to 3.2.2, the last 3.x, and is cached for 7 days;
the pinned URL is cached for a year.

**Fix.** The hash was recomputed on 2026-10-12:

```html
<script id="MathJax-script" async
  src="https://cdn.jsdelivr.net/npm/mathjax@3.2.2/es5/tex-mml-chtml.js"
  integrity="sha384-Wuix6BuhrWbjDBs24bXrjf4ZQ5aFeFWBuKkFekO2t8xFU0iNaLQfp2K6/1Nxveei"
  crossorigin="anonymous"></script>
```

Moving to MathJax 4 is a separate decision.

### 18. Without JS the phone menu is dead and `/thesis` is blank

Robustness · S · Verified · earlier, smaller items

- At 390 px with JS off, the toggler does nothing, so About, Bookshelf,
  Inspirations and Wiki are unreachable; the footer and Explore bar don't
  link them.
- `/thesis` is an empty page whose only content is `window.location.replace`
  (`default.html:36-40`). It's canonical and in the sitemap, and its test,
  `page.url contains "/thesis"`, would also redirect any future URL such as
  `/thesis-defense/`.

**Fix.**

- Right after the `main.css` `<link>` (`default.html:16`; the selectors tie
  with Bootstrap's on specificity, so order decides), add:

  ```html
  <noscript><style>
    .navbar-collapse.collapse { display: block }
    .navbar-toggler, form.bd-search { display: none }
    @media (max-width: 991.98px) {
      .mediumnavigation { position: static }
      .site-content { margin-top: 0 }
    }
  </style></noscript>
  ```

  The media query keeps the opened menu from covering the page as a fixed
  bar. This covers JS being off, not `mediumish.js` failing to load. Tested
  in Chrome at 390 and 1280 px with JS on and off.
- Link `/thesis.pdf` from `about.md:88` directly, give `thesis.md` a body
  link to the PDF and `sitemap: false`, and test `page.url == "/thesis"`.

### 19. Landmarks, headings, pagination and card links

Accessibility · S · Verified · earlier #23

Checked with html-validate 9 on all 91 pages, axe-core 4.10 (contrast rule
off) and Chrome's accessibility tree.

- **Pagination** (`index.html:60-62`, `_includes/pagination.html`): a `<nav>`
  inside `<span role="navigation">`, labeled "Page navigation example"; links
  named «, <, >, »; no `aria-current` on the current page. Fix: use a `<div>`,
  `aria-label="Blog pages"`, words in the links' `aria-label`s, and
  `aria-current="page"`.
- **Heading outline:** every wiki page puts `<h2>Wiki</h2>` before its `<h1>`
  (`_layouts/wiki.html:6-8`), and the TOC title is an `<h3>` right after the
  `<h1>` (`post.html:50`, `wiki.html:35`). Fix: render the wiki label as a styled
  `<p>`, and the TOC as `<nav aria-label="Table of contents">` in #33's TOC
  include.
- **Skip link and landmarks:** there's no skip link (the first TOC link is
  Tab stop 11 on a post at desktop width), and `.mainheading` and the Explore
  band sit outside any landmark. Fix: add `<a class="sr-only sr-only-focusable
  skip-link" href="#content">` with a fixed-position focus style so the nav
  doesn't cover it, `id="content"` on `<main>`, `<header
  class="mainheading">`, and `<nav aria-label="Categories">` for Explore.
- **Duplicate card links:** each card's cover and title link to the same
  post (`postbox.html:6-10`, `featuredbox.html:9-13`); `/categories` has 85
  cards. Fix: add `tabindex="-1" aria-hidden="true"` to the cover link.
- **Main nav:** no `aria-current`, and "Blog" is active only on `/`, not on
  posts, `/page2/` or `/categories`. Fix: #33's data-driven nav fixes both.
- **Prev/next:** on the oldest post the lone "Next" link ends mid-column
  (`post.html:95-104`). Fix: add `ml-auto` and drop the empty `.clearfix`.
- **Code blocks** (Likely, Safari only): scrollable `<pre>`s can't take
  keyboard focus. Fix: use `{{ content | replace: '<pre class="highlight">', '<pre class="highlight" tabindex="0">' }}`
  in `post.html:55` and `wiki.html:40`.

### 20. Internal links without a trailing slash cost a 301

Performance, SEO · S · Verified · earlier, smaller items

The nav's `/wiki` (all 91 pages), `/wiki/kubernetes/{commands,patterns,potholes}`
in `_includes/wiki-left-panel.html:55,60,65`, `/page6` in
`pagination.html:32`, and seven content links (`/go-opts`, `/istio-short`,
`/k8s-ha`, `/microservices`, `/one-on-one`, `/lean-startup`,
`/venture-deals`) each redirect on GitHub Pages (`curl -sI
https://charlesxu.io/wiki` → 301). `check-site.py`'s `served_file` quietly
accepts them by falling back to `name/index.html`.

**Fix.** Add the slashes, and make that fallback an error (see #24).

### 21. Deploys include 3.8 MB of unlinked files

Hygiene · S · Verified · earlier #28, sev.md follow-up

- `assets/css/bootstrap.min.css` (140,891 B, unpurged) and `screen.css`
  (20,216 B). Nothing links them since the CSS bundle. Moving both into
  `_sass/` with `@use` unchanged builds a byte-identical `main.css`, and the
  4-hour wait the PageSpeed review asked for has passed.
- `assets/images/race/` and `circle-cropped*`: 2.5 MB with their WebPs,
  referenced only by `_data/images.yml`.
- `assets/cloud-eng-summit-2021.pdf` (1.1 MB): linked from nowhere, but
  listed in `sitemap.xml`.

**Fix.** Move the CSS files into `_sass/` and update the README and AGENTS.md
paths. For the images and the talk, see D5.

### 22. The newsletter block shifts the page on phones

Layout · S · Verified

Below 1000 px `.alertbar` is `position: relative !important`
(`screen.css:643-650`), so it's in the page flow, but `mediumish.js:40-44`
still toggles its `display` at 280 px of scroll. On `/404.html` at 390×844,
the 182 px block appears inside the viewport and pushes the Explore band
down: CLS about 0.07–0.09, depending on scroll position. Long posts insert it
off-screen.

**Fix.** Add `display: block !important` to that media-query rule (CLS then
measures 0.001). The block then always shows at the end of the page on
phones, which is what removes the shift.

### 23. Selecting across code blocks copies line numbers

Content · S · Verified · earlier #5, #9

`line_numbers: true` (`_config.yml:84`) puts a Rouge gutter on all 114 code
blocks, 26 of them with a lone "1". Nothing sets `user-select: none`, so a
selection that starts above a block or spans blocks picks up "1\n2\n3…"; a
drag inside one block's code cell copies only the code. The gutter's
`pre.lineno { color: #9999 }` (`_sass/_syntax.scss:69`) is a four-digit hex
(60% alpha); `#999` was probably meant.

**Fix.** Turning line numbers off is D3. Either way, add
`.rouge-gutter { -webkit-user-select: none; user-select: none }` and fix the
color.

### 24. Smaller `check-site.py` gaps and crashes

Safety net · S · Verified on crafted fixtures; none occurs today

- **Missed:** `url()` in `style=""` attributes and `<style>` blocks (README
  promises "CSS `url()`s"), inline event handlers (#8), an uppercase host
  (`HTTPS://CHARLESXU.IO/…` compares `netloc` case-sensitively), and an empty
  `src=""`.
- **False positives:** a fragment whose target is `<a name>`, and a directory
  with a dot in its name.
- **Crashes:** `<meta property="og:image">` without `content`
  (`AttributeError`), and running with no arguments (`IndexError`; the other
  scripts use argparse).

**Fix.**

- Scan `style` attributes and `<style>` data with `CSS_URL`, after stripping
  `CSS_COMMENT`.
- Compare `parts.hostname`, not `netloc`.
- Report an empty `src`.
- Add `<a name>` values to the fragment targets. Only `<a>`: accepting every
  `name` would let `#description` pass.
- Have `served_file` try `name`, then `name.html`. A link that resolves only
  to `name/index.html` is #20's slashless-directory error, which also covers
  directory names with a dot.
- Use `attrs.get("content") or ""`.
- Parse arguments with argparse.

### 25. `make-social-cards.py` ignores transparency, EXIF and ICC

Tooling · S · Verified; ICC Likely

`_scripts/make-social-cards.py:25-27`: an RGBA cover's transparent areas show
whatever color they store (usually black) instead of `#182b23`, an
EXIF-rotated JPEG is carded unrotated, and the card loses the cover's color
profile (`ImageOps.pad` returns a new image) instead of converting it to sRGB
as `optimize-images.py` does. The three existing cards come from opaque,
upright JPEGs and are unaffected.

**Fix.** Reuse `optimize-images.py`'s `normalized()`, which already does the
EXIF transpose, the sRGB conversion and alpha; the test plan's rename makes
it importable (tested, run from the repo root and from `/`). `contain` plus `paste` also replaces `pad`
plus `expand`:

```python
from optimize_images import normalized

with Image.open(cover) as source:
    art = normalized(source).convert("RGBA")
art = ImageOps.contain(art, inner, Image.Resampling.LANCZOS)
card = Image.new("RGB", SIZE, BACKGROUND)
card.paste(art, ((SIZE[0] - art.width) // 2, (SIZE[1] - art.height) // 2), art)
```

Regenerating an existing card shifts its art by at most 1 px (floor versus
`pad`'s rounding).

### 26. Per-post figure scripts: a check that always fails; data in `/tmp`

Tooling · S · Verified · earlier, smaller items

- `_scripts/tp-cp-sp-ep-dp-pp/make_figures.py:55` reports `cover-480.webp`,
  `cover-960.webp` and `cover-1600.webp` as stale on every run, because it
  counts the WebP variants `make images` writes. A check that always fails
  gets ignored. The comment at `:31` still describes `image: assets/...`
  without the leading slash.
- `_scripts/parallel-tokenizer/results.md:3-6` points at
  `/tmp/tokenizer-audit/perf-v2/raw.json` and an "uncommitted working tree".
  The file still exists (379 KB), but macOS clears old `/tmp` files.
- `make_figures.py` and `make_cover.py` both rewrite `cover.png`, which
  leaves the manifest stale, and their docstrings don't say so.

**Fix.** Skip `<name>-<digits>.webp` siblings of written PNGs in
`check_outputs`, and fix the comment. Copy `raw.json` into
`_scripts/parallel-tokenizer/` now and record the fork's commit SHA. Add
"then run `make images`" to both docstrings.

### 27. Typos and rendering slips

Content · S · Verified · earlier #12, #24

codespell misses all of these.

- **Visible markup:** a stray backtick at `2023-09-26-eks-sg.md:102`, and
  `####Aggregate` at `wiki/kubernetes/commands.md:109`, which renders
  literally and is missing from the TOC.
- **Posts:** `fourier.md:22` "only in only", `:35` "derivate";
  `lean-startup.md:92` "opponants"; `docker_multi_stage.md:62` "Image there
  is"; `ip-law.md:124` "who must a human being" and three "licence" among 26
  "license"; `eks-sg.md:12` "to receipt"; `scaling-istio.md:184` "threshing";
  `microservices.md:19` "Jeff Bezo"; `k8s-net.md:56` "destinated";
  `advices.md:158` "documentations"; `uncertain.md:40` "and and";
  `istio-short.md:50` "a init container"; `jwt.md:3` "Oauth";
  `parallel-tokenizer.md:3` says "5.5x Faster" while `:14` says 4.9x (5.5x is
  the best of four tokenizers, so "Up to 5.5x").
- **Pages and wiki:** `_pages/inspirations.md:61` "Stabbings" (Stebbings);
  `_pages/_bookshelf/cannot-recommend.md:10` "Ferris" (Ferriss);
  `_pages/_bookshelf/early-stage.md:27` "prepared for" (be prepared for);
  `wiki/kubernetes/patterns.md:20` "enalbing"; `wiki/vault.md:23`
  `enovy-ingress` and `:53` `.com.com`; `wiki/kubernetes/commands.md:120` has
  a stray `{{.}}`, so it prints each port's whole map after its nodePort.
- **Math:** `speculative-decoding.md:49` `$p'(x)$` becomes `p’(x)` (a curly
  apostrophe); `norm(max(…))` renders as italic letters.

**Fix.** One editing pass; write `p^\prime(x)` and `\operatorname{norm}`. A
`check-site.py` assertion that `<main>` text outside `pre`, `code`,
`script`, `style` and `svg` has no backtick, `**`, `####`, `](http`, `{{` or
`{%` would have caught both markup slips.

### 28. Six dead external links

Content · S · Verified · earlier, smaller items

| Link | Source | Result |
|---|---|---|
| getcruise.com | `_pages/about.md:66` | certificate expired |
| typetab.com | `_pages/inspirations.md:158` | domain for sale |
| meritechcapital.com/insights | `_pages/inspirations.md:80` | 404 |
| github.com/istio/test-infra/…/deps_update/main.go | `_posts/2017-8-13-multi-repo.md:23` | 404 |
| supremecourt.gov/opinions/17pdf/17-494_j4el.pdf | `_posts/2021-08-05-accounting.md:19` | 404 |
| tfswitch.warrensbox.com/Quick-Start/ | `wiki/infra-as-code/terraform.md:27` | 404 |

Checked with HEAD, then GET, rate-limited; 403 bot walls were ignored.

**Fix.** Point each at a current or archived copy, or drop the link; pin the
GitHub link to a commit. Cruise can stay as plain text.

### 29. Orphan category archives; empty pages in the sitemap

SEO, information architecture · S–M · Verified · earlier #22

- All 1,814 category links go to `/categories#…` (a 107 KB page), so the 19
  `/category/<name>/` archives have no internal links and are reachable only
  from `sitemap.xml`. Their titles are lowercase (`llm | Charles Xu`), and
  four of them hold one post.
- `/tags` renders an empty `<main>` and is in the sitemap; so is the empty
  `/thesis` (#18).

**Fix.** Delete `_pages/tags.md` and `_layouts/tags.html`; no post has tags
(#31). The categories depend on D4. If the `/category/<slug>/` archives are
canonical, point the chips (`post.html:74`) and the Explore bar
(`default.html:197,201`) at them and title-case their titles. If
`/categories` is canonical, give the archives `sitemap: false`.

### 30. Post share images lack `og:image` dimensions

SEO · S · Verified (output); platform behavior Likely · earlier #17

No post emits `og:image:width`/`height` (pages do, from the default card), so
Facebook downloads the image before it can render the first share.
`fourier/cover.png` is 640×270, below the 600×315 large-preview minimum.

**Fix.** Record each original's dimensions in `_data/images.yml` and emit
`og:image:width`/`height` from `page_metadata.rb`. Make a 1200×630 card for
fourier.

### 31. Dead template, config and repo files

Maintenance · S · Verified · earlier #21, #28

**Fix.** Delete what's listed, except where a bullet says otherwise.

- **Templates:**
  - Adsense: `post.html:30-34`, `_includes/adsense-under-header.html`,
    `adsense: "disabled"` and its keys in `_config.yml`.
  - Disqus: `page.html:17-25`; `_includes/disqus.html`, which is all
    comments; `default.html:230-232`, whose Liquid still runs inside `<!--
    -->`; `disqus: false` in `post.html`; the `#comments` CSS.
  - Star ratings: `_includes/star_rating*.html`, `_sass/_stars.scss`, and its
    29 KB compiled copy `_starsnonscss.scss`, which `main.scss:18` still
    loads (28 KB of the unpurged dev CSS).
  - `{% assign author = site.authors[…] %}` in `post.html`, `postbox.html`
    and `featuredbox.html`; `site.authors` doesn't exist.
  - The `group` logic in `categories.html` and `tags.html`, and the Explore
    bar's `first[0] == null` branch (`default.html:195-198`).
  - The empty `.after-post-tags` list on every post (`post.html:82-91`); no
    post has tags.
  - Classes nothing styles or scripts: `smoothscroll` (`post.html:74,87`),
    `b-0`, `wj-contact-form validate`, `one-line-self-intro-gap`.
  - `itemprop="dateModified"` with no `itemscope`, and layout front matter
    `title` and `permalink`, which layouts can't set.
- **Repo:**
  - `docker-compose.yml`: `docker compose config` rejects it, and it uses the
    deprecated `jekyll/jekyll` image.
  - `site/_config.yml`.
  - `assets/css/bootstrap.min.css.map` (562 KB; its sources aren't in the
    repo); then drop the `"*.map"` exclude and AGENTS.md's line about it.
  - `changelog.md`, the theme's 2019 changelog.
- **`_config.yml`:** the jekyll-assets TODO (`:1`); the minifier comment
  (`:45`), which reads `-t` as if it mattered (it's `--trace`); `exclude`
  entries for files that no longer exist, and for `Gemfile`/`Gemfile.lock`,
  which Jekyll excludes by default. Keep `cloudflare_purge.token` there as a
  guard.
- **`.gitignore:6`:** `.jekyll-metadata/*` doesn't match the
  `.jekyll-metadata` file; use `.jekyll-metadata`.
- **`LICENSE.txt`** is the theme's MIT license (© 2019 WowThemes.net), not
  one for the content. Rename it `LICENSE-mediumish.txt`; a content license
  is your call.

### 32. Dead, overridden or invalid CSS

Maintenance · S · Verified · earlier #28

Checked with PurgeCSS's `rejected` output and computed styles. PurgeCSS
strips most of this in production, so the cost is maintenance.

- **Invalid or overridden:** `pre { margin-bottom: -rem }` (`screen.css:91`,
  dropped by browsers); `div.article-post>table td, th` (`:1084`) leaves `th`
  unscoped; `.mediumnavigation`'s `rgba(255,255,255,.97)` (`:103`) loses to
  `.bg-white`'s `!important`; `.jumbotron.fortags .col-md-4` repeats
  `.transpdark`.
- **49 selectors no template emits:** `.author-thumb`, `.post-top-meta*`,
  `.authorpage*`, `.sociallinks*`, `.dropdown-menu`, `.card-block`,
  `.listrelated`, `.sticky-top-80`, `.post-excerpt p` (`main.scss:10-13`)
  and more. `.dot:after` and `.btn.follow` ship only because their words
  appear in post prose.
- **Reinvented Bootstrap:** `.flex-first`/`.flex-md-unordered`
  (`:1044-1065`, 22 lines of prefixes) duplicate Bootstrap 4.1's
  `order-first order-md-1`.
- **Prefixes:** `-moz-box-sizing`, `-webkit-`/`-moz-column-count` and
  `-webkit-`/`-moz-box-shadow` are obsolete. The five prefixed placeholder
  rules (`:832-850`, one per engine) fold into one
  `.form-control::placeholder { color: rgba(0, 0, 0, .5) }`; deleting them
  outright would change the placeholder to Bootstrap's grey.
- **Style:** `!Important` (`:645-676`); `a { transition: all .2s }` animates
  every property where `color` is enough.
- **Organization:** custom rules live in `main.scss:20-98`, `screen.css` and
  `_sass/_syntax.scss` with no stated split, and `main.scss:2-3` still says
  "Add a comment to make this file sass-y". After #21, fold `main.scss`'s
  rules into the moved `screen.css`.

**Fix.** Delete the dead rules, prefixes and `.flex-*` helpers, fold the
placeholders, fix the invalid declarations and scope `th`.

### 33. Hand-copied nav, wiki panel and TOC markup

Simplification · S · Verified · earlier #24

- **Main nav** (`default.html:86-124`): five copies of the same
  `{% if %}<li class="nav-item active">{% else %}…` block. Fix: loop over a
  five-entry `_data/nav.yml`, emit `aria-current="page"`, and treat posts and
  `paginator.page` as Blog (#19).
- **Wiki panel** (`_includes/wiki-left-panel.html:1-99`): every URL is
  written twice (href and active check), links are bare `<a><div>`s with no
  `<nav>` or list, group names are uppercase in the source, and
  `overflow-y: scroll` always reserves a scrollbar. Fix: move the entries to
  `_data/wiki.yml` and render `<nav aria-label="Wiki">` with lists and
  `aria-current`. AGENTS.md's "plus a link in `_includes/wiki-left-panel.html`"
  becomes "plus an entry in `_data/wiki.yml`".
- **TOC:** the same block, with an inline `color: #9c9c9c`, is in
  `post.html:49-52` and `wiki.html:34-37`. Fix: make it an include and move the
  color to CSS.
- **Two-pane pages:** `col-md-2`/`col-md-3` with inline `min-width: 200px`, a
  spacer `<div>` and inline `font-size` are repeated in `wiki.html:10-20`,
  `about.md`, `bookshelf.md` and `inspirations.md`. Each page also wraps its
  content in `.serif` with `font-size: 0.92rem` to undo
  `.layout-page .article-post`'s sans font (`screen.css:946-949`). Fix: add
  one `.side-panel` class and delete that override.

### 34. README: no deploy or preview steps; drift from the code

Docs · S · Verified · earlier, smaller items

- Nothing in the README explains how to deploy (`make push`) or preview.
  Docker and Node are mentioned only inside the `make check` paragraph.
- The LaTeX section never says a post needs `math: true`; only AGENTS.md
  does.
- `==highlight==` doesn't render with kramdown's GFM, and `{:.myTable}`
  refers to a class that exists nowhere.
- "`make check` … tests `_scripts/check-site.py`" omits the Node tests.
- "Upstream" points at theme PRs that no longer apply: the site shares none
  of the theme's JS or CSS loading.
- "formatings", "LaTex", and a manual table of contents that lists the
  page's own title.
- The build command and the image rules are written out in both the README
  and AGENTS.md.

**Fix.** Replace "General markdown and rendering tips" with three bullets
(`math: true`, `<div class="figure-wide">`, `{% raw %}`); add short Preview
(`make serve`) and Deploy (`make push`: what it builds, checks and mirrors)
sections; drop "Upstream" and the manual TOC. Keep procedures in the README
and rules in AGENTS.md, with AGENTS.md linking to README sections instead of
repeating commands.

### 35. Dev-tooling papercuts

Tooling · S · Verified · earlier #21

- **Python 3.9:** with macOS's `/usr/bin/python3` (3.9.6), `make images`
  fails with `Could not find a version that satisfies the requirement
  Pillow==12.3.0`; the 3.10+ requirement is only a comment. Fix: make the
  stamp recipe's first line
  `$(PYTHON3) -c 'import sys; sys.exit(sys.version_info < (3, 10) and "PYTHON3 must be Python 3.10+")'`.
- **Dev server on the LAN:** `docker.watch` publishes `-p 4000:4000` on all
  interfaces (`lsof`: `*:4000`), so anyone on shared Wi-Fi can read drafts.
  Fix: #12's `serve`, which binds `127.0.0.1` by default.
- **Floating npm dependencies:** `npx --yes purgecss@8.0.0` pins only the
  top-level package (its `postcss`, `commander` and `fast-glob` are `^`
  ranges), and `npx http-server` isn't pinned at all; both run on the host
  with your privileges. Fix: add a minimal `package.json` and
  `package-lock.json`, install with `npm ci`, and add `node_modules/` to
  `.gitignore`. Add `package.json` and `package-lock.json` to `exclude:`:
  Jekyll would publish them.

### 36. TLS 1.0/1.1 accepted; no HSTS or security headers

Security, outside the repo · S · Verified · earlier #8

`openssl s_client -tls1` and `-tls1_1` (with `@SECLEVEL=0`) complete
handshakes, and responses carry no `Strict-Transport-Security`,
`X-Content-Type-Options`, `Referrer-Policy` or `X-Frame-Options`. The impact
on a static site without logins is small, since http→https already
redirects.

**Fix.** Set Cloudflare's minimum TLS version to 1.2, enable HSTS, and add
the headers with a Transform Rule.

### 37. Deploy commits carry a work email

Privacy · S · Verified · earlier, smaller items

The public `cxuu.github.io` repo has 68 commits by
`charles.xu@snowflake.com`. It has no repo-local `user.email`, so deploy
commits use the global one in `~/.gitconfig`.

**Fix.** If that's not intended, run `git -C ../cxuu.github.io config
user.email <you>@users.noreply.github.com`, or let CI commit as the bot
(#13).

### 38. JS files and plugin entry points lack header comments

Docs · S · Verified

The plugins' other comments explain why; these spots don't.

- `assets/js/mediumish.js` and `about.js` have no header saying what they do
  and on which pages, for example "Navbar toggle, hide-on-scroll and the
  newsletter bar, on every page" and "Rotates the About tagline; static under
  reduced motion."
- The search loader (`_includes/search-lunr.html:10-52`) doesn't explain its
  states or why Enter before load sets `searchWhenReady`. If the test plan
  moves it into `mediumish.js`, comment it there.
- `responsive_images.rb`: the public `rewrite` and `check` have no header
  comments. The `slice_when`/`map(&:last)` step in `sizes` (`:110-112`),
  which merges neighboring bands of equal length, is the subtlest line in the
  file and has none. `set_dimensions` (`:186-196`) doesn't say why it leaves
  both dimensions unset for a non-px `width`; only AGENTS.md does.
- `mediumish.js:40`'s bare `280` needs a name (`var alertAfter = 280; // px
  scrolled before the newsletter bar appears`), and `about.js:13`'s
  `fadeDuration = 400` must match `transition: opacity 0.4s` in
  `screen.css:453`, and nothing says so.

**Fix.** Add the comments above (the quoted examples can go in as written),
name the `280`, and note on one side that `fadeDuration` must match the CSS
transition.

### 39. The tp post's diagrams are unreadable on phones

Content · S · Verified (computed from the SVGs) · earlier #27

The tp post's SVGs use 9–17 px text in a 700-unit `viewBox`. At 390 px the
figure is `calc(100vw - 60px)` = 330 px wide, a scale of 0.47, so 12 px text
renders at about 5.7 CSS px. No content image links to its original, so
readers can't open one to zoom.

**Fix.** Wrap each tp figure in a link to its SVG, so phones can open and
zoom it. In future figures, use text of at least 28 units in a 700-unit
`viewBox`: at 360 px the figure is 300 px wide (scale 0.43), so that renders
at about 12 CSS px.

---

## Nits

- **Ruby** (`_plugins/`):
  - `Length` and `Band` are mutable Structs inside the frozen `LAYOUTS`
    (`LAYOUTS["article"].first.length.px = 0` succeeds). Ruby 3.4's
    `Data.define` gives immutable values with the same `new` and equality.
  - `ascii_only` (`search_index.rb:21`) escapes every curly quote and dash
    (+3.6 KB). `text` already folds U+2028/2029 into spaces, so only titles
    need protecting; `script_safe: true` escapes exactly U+2028, U+2029 and
    `/`.
- **JavaScript:** the PurgeCSS safelist (`_scripts/purgecss.config.cjs`)
  changes nothing: every class in it appears literally in `assets/js/*.js`,
  and the purged CSS is byte-identical with an empty config. Empty the list,
  and keep the comment as the rule for future runtime-assembled classes.
- **Python:**
  - `optimize-images.py:81` parses the manifest from a string, so a merge
    conflict in `_data/images.yml` reports `in "<unicode string>"`. Pass the
    open file and PyYAML names it.
  - Images over 179 MP raise `Image.DecompressionBombError`, which `:212`
    doesn't catch, so it escapes without the path. Add it to the `except`
    tuple.
  - An empty `assets/images/` divides by zero in `print_summary` (`:240`);
    only a test fixture would hit it. Guard with `if original:`.
  - codespell (`check.sh:10`) skips `_includes`, `_layouts`, `_data`,
    `index.html` and `404.html`, which hold visible text. Add them; they're
    clean today.
- **Templates:**
  - No print styles: printing a post includes the share column, the
    newsletter form, 19 Explore chips and prev/next. One `@media print` rule
    can hide them.
  - Breakpoints at 768, 991, 999 and 1024 px don't match Bootstrap's 767.98
    and 991.98: at exactly 768 px `.share` gets its mobile margin inside the
    desktop layout. Use 767.98 and 991.98, and fold 999 into 991.98.
  - The footer copyright is off-center from 576 to 991 px
    (`default.html:214`); use `col-12`.
  - Titles print unescaped in eight places; a title like `Option<T>` would
    become markup. Use `| escape`.
  - Drop `shrink-to-fit=no` (a Safari 9 workaround) and
    `type="text/javascript"` from `<head>`.
  - The newsletter logo is decorative next to its text: `alt=""`.
  - The Mailchimp form has no honeypot field (`b_<u>_<id>`), so bots can
    subscribe addresses. Add Mailchimp's hidden field.
  - The 404 page's `display-1` heading wraps to three 96 px lines at 390 px.
    Shrink it below 576 px with a media query.
- **Build:**
  - `make clean` removes `.jekyll-cache` but not `_site`; `$(shell pwd)` →
    `$(CURDIR)`.
  - `optimize-images.py --check` is most of `make check`'s time. Fine for
    now; a stamp on `assets/images`, the script, the manifest and
    `requirements.txt` could skip it when nothing changed.
  - Local clutter outside git: a 104 MB `vendor/bundle/ruby/3.0.0` from the
    old host-Ruby setup, 17 Codex worktrees, six local branches already
    merged into `dev`, and eight `origin/fix/*` branches that were probably
    squash-merged in PR #2.
- **Site output:**
  - `/page2/` to `/page6/` share the home page's description; append "Page
    N".
  - `shell.md:135` sets `width="1680"` on a 686 px GIF, so it upscales and
    blurs from 1024 px. Use its intrinsic width.
  - 28 posts start their body headings at `###`; promote them to `##`.
  - The tp table's first `<th>` is `&nbsp;` (axe `td-has-header`); call it
    "Parallelism".
  - Four titles run past 85 characters (`kip`, `git2`, `rsm`, `2s-comp`), so
    search results truncate them. Shorten them; seo-tag builds `<title>` from
    `title`, so a separate SEO title would need a layout change.
  - `/apple-touch-icon.png` returns 404 (iOS looks for it at the root), so
    iOS likely uses a page screenshot for home-screen icons. Add a 180×180
    one with `<link rel="apple-touch-icon">`.
    `site.favicon` is unused and `favicon.png` is byte-identical to
    `logo.png`; delete both.
  - The feed's 19 `src`s, 4 `srcset`s and 2 `href`s are root-relative and
    rely on `xml:base`, which some readers ignore. Leave it unless a reader
    you care about shows broken images; then absolutize them in the feed
    page's `output` in a `:site, :post_render` hook, as `search_index.rb`
    edits its page. Math posts show raw `$…$` there; leave that.
  - There's no visible RSS link; add one to the footer.

---

## Test plan for 95% coverage (#9)

Prototype suites written during this review reach 100% line and branch
coverage on every in-scope file. They're outside the repo: Python in
`/tmp/review-findings/python-poc/`, JS in `/tmp/rv-js/_scripts/tests/`
(`lunrsearchengine.test.cjs`, `search-loader.test.cjs`), Ruby in
`/tmp/rv-tests/`. Copy them before macOS clears `/tmp`, or rewrite them from
the notes below.

### One entry point

Add `make test`, run every suite with coverage on every time, and make
`check` depend on it. Measuring costs well under a second here, so a separate
`make coverage` would only add a second way to run the same tests.

```make
.PHONY: test
test: $(IMAGES_VENV_STAMP) docker.devbox
	node --test --experimental-test-coverage \
		--test-coverage-include='assets/js/*.js' --test-coverage-exclude='assets/js/lunr.js' \
		--test-coverage-lines=100 --test-coverage-branches=100 --test-coverage-functions=100 \
		_scripts/tests/*.test.cjs
	$(IMAGES_PYTHON) -m coverage erase
	$(IMAGES_PYTHON) -m coverage run -m unittest discover -s _scripts/tests
	$(IMAGES_PYTHON) -m coverage combine --quiet
	$(IMAGES_PYTHON) -m coverage report
	$(DOCKER_RUN) $(DEVTOOL_IMG) bundle exec ruby _scripts/tests/ruby/run.rb

check: test # then codespell, build, check-site and images --check, as today
```

`DOCKER_RUN` comes from #12. `test` replaces `check`'s own `node --test` and
`unittest discover` lines. `coverage erase` matters: `patch = subprocess`
implies parallel data files, and a failed run's leftovers would otherwise be
merged into the next report.

### Scope

- **In:** `_scripts/check-site.py`, `optimize-images.py` and
  `make-social-cards.py`; `assets/js/mediumish.js`, `about.js`,
  `lunrsearchengine.js` and the search loader; all four `_plugins/*.rb`.
- **Out:** vendored `assets/js/lunr.js`; config (`purgecss.config.cjs`,
  `_config.yml`); `check.sh` and the Makefile, which CI (#13) exercises; and
  the per-post figure generators in `_scripts/tp-cp-sp-ep-dp-pp/` and
  `_scripts/parallel-tokenizer/`. Those are one-off, deterministic and
  self-checking: re-running `make_figures.py` reproduced every committed file
  byte for byte, so "re-run, then `git diff --exit-code`" is their test, and
  unit tests would only pin SVG coordinates.
- **Templates** aren't something coverage can measure. Their tests are
  structural assertions on the built site (the last part of this plan).

### JavaScript (Node's built-in runner; no new dependency)

- Pass `{ filename: scriptPath }` (an absolute path) to every
  `vm.runInNewContext` call (`mediumish.test.cjs:67`, `about.test.cjs`).
  Without it the report is empty; with it, both files report 100%.
- Add `lunrsearchengine.test.cjs`: load `lunr.js` into the same `vm` context
  without a filename, so it isn't counted; blank the front matter while
  keeping line offsets (`src.replace(/^---\n[\s\S]*?\n---\n/, m =>
  m.replace(/[^\n]/g, ' '))`); use a fixture `documents` array with an `<img
  onerror>` title and a URL containing `'`; and assert on the generated HTML.
  Cover escaping, the separator and trimmer (`fmt.Println`, `istio?`), the
  160-character snippet, the `QueryParseError` catch, no results, an empty
  query and the close handler. The prototype also passes on lunr 2.3.9, so
  it guards #10.
- Move the loader from `_includes/search-lunr.html` into `mediumish.js`
  (already deferred on every page), with the two script URLs in `data-`
  attributes on the form. It becomes an ordinary covered file, and 91 pages
  lose an inline script.
- Two traps, both verified: Node applies thresholds to the **total**, not
  per file (with three search tests skipped, the engine fell to 88% and a
  95% gate still passed), and a file no test loads doesn't appear at all. So
  set the JS thresholds to 100, since every file reaches 100% today, and add
  a small test asserting that every `assets/js/*.js` except `lunr.js` has a
  matching `*.test.cjs`. On Node 26.7 or later, pass
  `--test-coverage-include-all` instead, which reports unloaded files as 0%,
  and drop the meta-test.
- Name the vendored file exactly: an exclude glob of `assets/js/lunr*.js`
  silently drops `lunrsearchengine.js` too. Update it if #10 renames the
  file.

### Python (coverage.py)

- First, in its own commit (see "Suggested order"): rename the three
  scripts to `check_site.py`, `optimize_images.py` and
  `make_social_cards.py`, so the tests and #25 can import them. Update the
  Makefile (`IMAGES_SCRIPT`), `check.sh`, `_scripts/tests/test_check_site.py`
  (`CHECKER`), each script's own usage line or docstring, the README and
  AGENTS.md. Then run `make images` to rewrite the manifest's header line,
  which comes from the script's path; `make images-check` fails until then.
- Pin `coverage==7.16.2` in `_scripts/requirements.txt` (`patch =
  subprocess` needs 7.10+); the venv stamp rebuilds itself.
- Add a root `.coveragerc` (Jekyll ignores dotfiles):

  ```ini
  [run]
  branch = true
  # test_check_site.py runs the checker in a subprocess.
  patch = subprocess
  source = _scripts
  omit =
      _scripts/tests/*
      _scripts/tp-cp-sp-ep-dp-pp/*
      _scripts/parallel-tokenizer/*
  data_file = .venv-images/coverage

  [report]
  fail_under = 95
  show_missing = true
  skip_covered = true
  exclude_also =
      if __name__ == .__main__.:
  ```

  With `source`, a file no test runs counts as 0%: removing the image tests
  made the report fail at 40%.
- `test_optimize_images.py` (15 tests in the prototype): import
  `optimize_images`, patch `ROOT`, `MANIFEST`, `SCRIPT`, `LOSSY`,
  `UNPROCESSED` and `CSS_BACKGROUNDS` onto a `TemporaryDirectory`, and call
  `main()` with a patched `sys.argv`. In the tests, patch
  `ProcessPoolExecutor` with `ThreadPoolExecutor` (the script keeps
  processes): on macOS, spawned workers re-import the module and lose the
  patches. Use `patcher.start()` plus `addCleanup`, because `enterContext`
  needs 3.11 and the Makefile allows 3.10.
- Fixtures: tiny in-memory images (`Image.new`, seeded noise a few pixels
  tall). Keep pixel counts small: a 600×60 image took 2–3 s to encode
  losslessly, noise or gradient. Don't assert on encoder byte counts; patch
  `encoded` to return fixed sizes when testing pruning and the original
  competing.
- Behaviors worth pinning: owned-variant validation, the overwrite refusal
  and orphan deletion; unsafe names, strays and stem clashes; 16-bit
  rejection, alpha handling and EXIF transpose; animation passthrough, LOSSY
  versus lossless, and CSS background widths; `--check` exit codes.
- `test_make_social_cards.py`: size, output name and background color, plus
  RGBA and EXIF-6 cases after #25. For `check-site.py`, add a clean-site test
  (exit 0, "Site check passed.") and the "build the site first" guard.

### Ruby (minitest and stdlib `Coverage`)

- Put tests in `_scripts/tests/ruby/`, **not** `_plugins/test/`: Jekyll
  requires every `_plugins/**/*.rb` on each build, so a test file there would
  load as a plugin.
- Add `group :test do gem "minitest", "~> 5.25" end` (5.x keeps
  `minitest/mock`, which 6.0 moved to the `minitest-mock` gem), then `bundle
  lock` and `make docker.devbox`. Today `bundle exec` can't load minitest even
  though the image has it.
- `run.rb` (about 35 lines) starts stdlib `Coverage` with lines and branches,
  requires the plugins, runs minitest, prints per-file percentages and exits
  non-zero if any file is below 95%. Stdlib `Coverage` needs no new gem;
  SimpleCov would also need its `coverage/` output excluded from the build.
- Fixture site: about 10 files built once with `Jekyll::Site`, the real
  plugins and jekyll-archives; pure functions like `sizes` and `Length#css`
  are tested directly. The prototype has 31 tests and runs in 0.2 s.
- Behaviors worth pinning: exact `sizes` strings per layout and cap; the
  rewrite (a px width scales the height, a `%` width is left alone, explicit
  `sizes`, `loading` and `decoding` win, baseurl, remote and `data:` sources,
  `<img>` text in comments and raw-text elements); `check` raising in
  production with the path and referrer and warning otherwise; the search
  index's inclusion, order, date prefix, heading colons, dropped gutters and
  fatal missing engine; archive descriptions and cards; `asset_url`'s `?v=`.
  Add a seeded property test of `SCANNER` against Nokogiri (about 2,000
  cases, under 1 s).
- Ruby's branch coverage ignores `&&`, `||` and `||=`, so treat 95% as a
  floor and judge the suite by the behavior list. Whether `LAYOUTS` still
  matches the CSS can't be unit-tested; keep the headless-Chrome measurement
  as a manual script.

### Assertions on the built site

Coverage can't see templates, so extend `check_site.py`, with unit tests in
`test_check_site.py`. Build each check with its item where one exists; the
rest belong to #9. A check that today's site fails starts as a warning and
becomes an error once its fix lands (see "Suggested order").

- every `<img>` in `<main>` has an `alt` attribute (#7);
- no Markdown or Liquid leaks into rendered text (#27);
- a local link to a directory without a trailing slash is an error (#20);
- the first heading is the `<h1>`, there's one `<main>`, and no landmark sits
  in a `<span>` (#19);
- every post `<img>` sits in an `.article-post > .figure-wide`, which the
  `figure` band in `responsive_images.rb` assumes (all 81 do today);
- `assets/css/` holds only `main.css` (#21);
- every `og:image` has a width and height matching the file, at least
  600×315 (#30);
- HTML sitemap entries are canonical URLs, and no listed page's `<main>` is
  empty apart from its `<h1>` (#18, #29);
- external `<script src>` origins are an allowlist, and jsDelivr URLs carry
  an exact version and `integrity` (#17);
- fenced `yaml` blocks parse (#3), run from `check.sh` next to codespell.

An `html-validate` step (`npx --yes html-validate@9`, about 4 s for 91
pages, the recommended preset minus the style rules that are noise on
minified HTML) is an optional extra layer.

---

## Earlier reviews: what's still open

Status of `improvement-ideas.md` (2026-10-09, items 1–28) and the PageSpeed
`sev.md` (S1–S7), checked against the code at `a05e6c0`, not against commit
messages.

| Status | Items |
|---|---|
| Done | earlier #2 search-index escaping; earlier #7 share buttons; earlier #13 jQuery and Bootstrap JS removed; earlier #14 WOFF2 fonts and SVG icons; earlier #16 faster build; earlier #18 `make check` and strict Liquid; earlier #20 Ruby, gem and Pillow upgrades; S1 cover downloads (but LCP is still 2.7 s, #6); S3 page structure; S5 one CSS bundle; S7 read-before-write scrolling |
| Carried | Each item's metadata line names its sources. Earlier #4 is D2, and earlier #25 is D7. |

Not carried, because they're optional or now low value:

- the `/archive/` page and "Blog first in the nav" (earlier #1); #6 changes
  the home page anyway;
- reading time and an old-post banner (earlier #11); #4's visible date
  covers it;
- lossy card covers (earlier open question 11);
- pre-rendered math (earlier #26);
- the narrower PurgeCSS `--content` (earlier #28), which now saves 156 B;
- Cloudflare's Brotli rule, which is in the README;
- the Explore background (earlier #27), which downloads 29.5 KB on phones and
  70.5 KB from 768 px on every page; lazy-load it only if you want those
  bytes back.

Smaller earlier items left to you: a CSP (earlier Appendix E has a tested
policy that hashes the inline scripts; moving them into files later drops
the hashes), six cross-domain redirects (earlier Appendix B), `theme-color`,
the bookshelf cleanups, front-matter `defaults:` for `featured` and
`hidden`, the 20 unpadded post filenames, and `/categories`' "Category Llm"
capitalization (earlier #22).

---

## Already good

- **Image pipeline.** `optimize-images.py` handled every mode, profile and
  orientation tried (RGB, RGBA, LA, P and RGB with tRNS, CMYK with and
  without profiles, EXIF transposes; 16-bit rejected), refused unsafe
  manifests and overwrites, and cancelled queued work on the first error.
  All 257 committed variants carry no metadata and match the manifest.
- **Responsive images.** Every `sizes` band matched the measured layout at 24
  widths from 320 to 3000 px, and the new `figure` band's math checks out
  (1.5 × 710 − 96 = 969). The rewrite leaves `<img>` text in comments,
  scripts and attributes alone. The hooks cost about 110 ms of a 1.45 s
  build.
- **Search.** The index is JSON built after every page renders, excluded
  pages stay out, results are escaped (XSS payloads rendered no element), and
  the lazy loader fetches exactly once, searches the latest text when ready,
  and retries after a failure.
- **JavaScript.** All ES5 and `defer`; no errors on 14 page types at 390 and
  1280 px; the scroll handler is passive, frame-coalesced and reads before it
  writes, which `mediumish.test.cjs` enforces; the existing tests are
  dependency-free and test behavior.
- **Layout.** No horizontal scroll at 390, 768 or 1280 px; `.figure-wide`
  clears the share column by at least 30 px up to 2560 px; no duplicate ids;
  one `<h1>` and one `<main>` per page; focus outlines intact.
- **Metadata.** All 91 titles are unique; every page has one description
  (none the site default), one `og:image` and one `twitter:card`; the sitemap
  matches the canonicals; JSON-LD parses everywhere.
- **Performance.** Mobile Lighthouse performance 96 (home) to 100, with CLS 0
  and TBT at most 120 ms on the pages in Measurements; desktop home 100. The
  purged `main.css` is 34,811 B (8.1 KB gzip), close to minimal.
- **Build and dependencies.** A 228 MB multi-stage image, a lockfile with two
  Linux platforms and checksums, every direct gem current, and no advisories
  from bundler-audit or pip-audit. The deploy repo matches a fresh build file
  for file. No secrets in the source repo's history.
- **Docs.** Every AGENTS.md claim the reviewers checked holds except its
  `node --check` line (#8), the README's image section matches the code, and
  the plugins' comments explain why (the PurgeCSS reason for build-time
  versions, ES5 and U+2028, archives and defaults).

---

## Measurements

- **Lighthouse 12.8.2**, mobile preset with simulated throttling, served
  locally with brotli, GA4 and Cloudflare Insights blocked:

  | Page | Performance | Accessibility | Best practices | SEO | LCP |
  |---|---|---|---|---|---|
  | `/` (median of 3) | 96 | 96 | 100 | 100 | 2.7 s |
  | `/` (desktop preset) | 100 | 96 | 100 | 100 | 0.4 s |
  | `/tp-cp-sp-ep-dp-pp/` | 98 | 90 | 100 | 100 | 1.9 s |
  | `/wiki/kubernetes/commands/` | 100 | 93 | 100 | 100 | 1.4 s |
  | `/about` | 100 | 88 | 100 | 92 | 1.7 s |

  Most accessibility deductions are `color-contrast` on the theme greys. One
  unbrotlied re-run of `/` scored 94 with LCP 3.1 s.
- **Third parties:** gtag transfers 165,072 B on all 91 pages, Cloudflare's
  beacon 10,224 B, and MathJax 256,540 B (script only) on the three math
  posts.
- **Build and check:** a Docker production build takes about 3 s. `make
  check` takes 43–52 s, of which `optimize-images.py --check` is 38–45 s.
- **Tools:** headless Chrome (Puppeteer, Playwright), html-validate 9,
  axe-core 4.10, coverage.py 7.16.2, the Node 26 test runner, Ruby 3.4's
  `Coverage`, bundler-audit, pip-audit, `dig`, `openssl`, `curl`.
