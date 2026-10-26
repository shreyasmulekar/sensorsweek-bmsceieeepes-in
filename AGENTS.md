<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep venue facts and registration destinations in the shared site data; the homepage passes its registration destination explicitly, while event buttons use their own event links, so changing one cannot redirect another event.
- Use the shared EventPoster renderer on event cards and detail pages to keep image sizing, centering and full-image visibility consistent.
- Keep Sensei facts derived from shared site data and preserve complete session history; this prevents conflicting event answers and lost follow-up context.
- Isolate Sensei with a local error boundary and return explicit request outcomes; chat failures must not replace event pages or enter conversation history as answers.
- Use AI Elements for Sensei messages, conversation and composer; maintain compatibility sizes in the shared Button component.
- Keep sponsor names and verified logo pointers in shared site data, with text-only rendering when identity is unverified; this avoids mismatched brands.
