# AlphaMail AI

A clean, deployable AI email assistant prototype.

## Features

- AI inbox analysis
- Email summaries
- Priority detection
- Task/deadline extraction
- Phishing/spam analysis UI
- Smart reply generation
- Security Center
- Account management UI
- Responsive frontend

## Deploy on Vercel

1. Push this folder to GitHub.
2. Import the repository into Vercel.
3. Add these Environment Variables in Vercel:

   `OPENAI_API_KEY` = your OpenAI API key

   `OPENAI_MODEL` = a model available to your OpenAI API project (the included default is `gpt-5-mini`).

4. Deploy.

The frontend works without the API key in demo mode. The live AI Analyze Inbox and Smart Reply endpoints require `OPENAI_API_KEY`.

## Local development

Install Vercel CLI:

```bash
npm install -g vercel
```

Then:

```bash
vercel dev
```

Create `.env.local` from `.env.example` and add your API key.

## Important production note

The current Gmail/Outlook account cards are UI/demo functionality. Real Gmail and Microsoft account access requires OAuth integration, secure token storage, and provider-specific API permissions. Do not collect or store user passwords.

## Project structure

```text
AlphaMail_AI/
├── api/
│   ├── analyze.js
│   └── reply.js
├── index.html
├── style.css
├── script.js
├── package.json
├── vercel.json
├── .env.example
├── .gitignore
└── README.md
```
