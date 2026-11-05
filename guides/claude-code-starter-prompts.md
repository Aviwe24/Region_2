# Claude Code starter prompts

Copy-paste prompts for working with Claude Code, built from a review of your sessions from August to November 2026. Each section fixes one thing that kept costing time: requirements arriving late, chats running too long, OneDrive and Power BI trouble, and work left waiting.

---

## 1. One-time setup: standing rules

Paste this **once** into a desktop chat. It saves the rules to your user-level CLAUDE.md, so they apply in every folder and every new chat. You won't need to repeat them.

```
Add these standing rules to my user-level CLAUDE.md (~/.claude/CLAUDE.md) so they apply in every folder. Show me the final text before saving.

## Files and OneDrive
- Build and write in a local working folder that OneDrive does not sync. Copy finished files into OneDrive or SharePoint at the end, changed files only.
- Before copying, deleting or rewriting more than 50 files in any OneDrive or SharePoint folder, stop and tell me how many and why.
- If a file is online-only or locked by OneDrive, tell me instead of working around it.

## Office apps (Power BI, PowerPoint, Word, Excel)
- Save before closing. Never close an app without saving unless I say "close without saving".
- If I might have the file open, ask me to save and close it, then wait.
- Make a dated backup copy before big edits.

## Email
- Save emails as Outlook drafts with the recipients filled in. Never send.
- Write like me: short, plain, non-technical.

## How to work with me
- If my request is missing the goal, files, output or audience, ask me before starting.
- For big jobs (many files, or more than about an hour), show me a short plan first and wait for my OK.
- Don't add things I didn't ask for. Suggest them instead.
- If a place, project or file name doesn't match anything, check with me (for example BAS vs TAS).
- When the chat changes topic or gets very long, suggest saving a handover and starting a new chat.
- End every finished task with a "Waiting on you" list: unsent drafts, files to save or close, questions, sign-offs. Say "None" if it's empty.
```

Why: rebuilds that rewrote about 1,838 synced files at a time set off an IT security alert. Power BI was closed without saving, so refreshed tables were lost. Unrequested extras (like the GV columns in the BAS join) had to be undone.

---

## 2. Starting a chat: the five-line opener

Most redoing came from facts that arrived after the work was built. Put them in the first message:

```
Goal: what I need and why
Files: @path or folder (and what's in it)
Output: format (Word / PPT / Power BI page / GDB / Outlook draft) and where to save it
Audience: who will read or use it
Don't: anything to leave alone or avoid
```

Typos are fine. **Names and numbers matter**: "BAS" for TAS, or "the mansion" for The Maison, sends Claude to the wrong thing.

### Examples from your own work

**GIS job**
```
Goal: ownership map for Soweto SAF and Empire-Perth SAF.
Files: GV 2023 property layer @"C:\...\GV2023.gdb", SAF boundaries @"C:\...\SAF.gdb"
Output: one GDB with a clipped layer per SAF, plus a summary table in Excel. Save in C:\Work\GV_clip.
Audience: me, for mapping in ArcGIS Pro.
Don't: join other datasets unless I ask.
```

**Red team before changing anything**
```
Goal: red team pages 9–12 of the IH Power BI report for the Executive Director.
Files: @"C:\Work\IH Report\IH Report.pbix"
Output: a numbered list of problems per page. Don't change anything yet; I'll pick what to fix.
Audience: Executive Director, Development Planning (strategic, non-technical).
Don't: touch the look book pages.
```

**Email**
```
Goal: reply to Monty's latest email to say we've received it, thanks.
Output: Outlook draft, 3–4 lines, plain and friendly.
Don't: attach anything or add extra detail.
```

**Teaching (with the student task up front)**
```
Goal: a 3-hour class session for 1st-year urban design students on missing middle housing typologies. The student task is an A1 typologies panel for Vrededorp (Fietas).
Output: a session plan and a slide deck for the mini-lecture.
Audience: first-year students, groups of 3–4, drawing by hand.
Don't: use made-up figures without labelling them as illustrative.
```

### Add these lines when you need them
- **Big job:** `Show me a plan first. Don't change anything until I say go.`
- **Unsure what you want:** `Ask me questions first.`
- **Changing direction:** `Stop. New direction: … Keep … , drop … .` (better than adding a new instruction while it's still working)

---

## 3. While it works

- **No need to ask "show me when it finishes."** Claude is told automatically when a background job ends.
- **One chat per file at a time.** Don't have two chats working on the same deck or report, and don't edit the file yourself while Claude is changing it.
- **When Claude asks you to save or close a file, do it, or reply `later`** so it doesn't wait. A chat sitting on an unanswered question is stuck.
- **Lower the effort setting for routine chats** (email replies, tracker refresh, moving files). Keep high effort for analysis and policy work. You hit a weekly-limit warning around 8–10 October.

---

## 4. Moving to a new chat (handover)

**When:**
- the topic changes (for example, from the email reply to the CPCC deck);
- you've finished one deliverable;
- the chat feels slow;
- `/context` shows it's more than about half full.

Several of your chats reached 700k–940k of a 1M-token limit.

**In the old chat:**
```
We're moving to a new chat. Save a handover note to memory called handover-<topic>-<date> with:
- what we were doing and why
- files and folders (full paths) and which version is current
- decisions made
- what's done, what's left, and what's waiting on me
Then give me one line to paste into the new chat.
```

**In the new chat:**
```
Read handover-<topic>-<date> in memory. Tell me what's open and what you'll do first. Don't change anything yet.
```

Start the new chat in the desktop app on your PC. From your phone, Claude can't start one for you; once it's open you can carry on from your phone.

---

## 5. Ending a chat

```
Before we stop: list everything waiting on me (unsent drafts, files to save or close, questions, sign-offs, anything you couldn't finish). Add them to my workload tracker.
```

---

## 6. Weekly check (from your phone)

Open a cloud session in the Claude app and paste:

```
List my Claude Code sessions that are blocked or waiting on me, newest first, with what each needs from me in one line.
```

When this guide was written, it would have shown:
- the IH story map, waiting on a question since 16 October;
- the IH database chat, waiting for the IH Report to be saved and closed in Power BI.

---

## 7. Phone cloud sessions vs desktop chats

| | Phone cloud session | Desktop chat (Remote Control) |
|---|---|---|
| Sees files on your PC, Outlook, Power BI, ArcGIS Pro | No | Yes |
| Reaches internal sites like the ISDP portal | No (network blocked) | Yes |
| Good for | Research, writing, this GitHub repo, checking on other sessions | Anything with your files or apps |

To work on your PC from your phone, start the chat in the desktop app with Remote Control on, then continue from the phone.
