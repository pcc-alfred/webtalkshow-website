---
number: 58
title: "Breaking Down AI Hype with Ian Cook: LLMs, AGI Skepticism, and Real-World Tools"
description: "Ian Cook, SVP of AI at Clue, joins to break down how LLMs actually work, why AGI skepticism is healthy, and how real professionals are putting AI tools to work every day."
date: 2026-02-17
duration: "49:30"
hosts:
  - Armando
guests:
  - Ian Cook
topics:
  - LLMs Explained
  - AGI Skepticism
  - AI Tools at Work
  - Agent Skills & Security
  - OpenClaw
  - AI Community Building
youtubeUrl: https://www.youtube.com/watch?v=RCRmVDF-Dyg
spotifyUrl: https://open.spotify.com/episode/3JLugAWPQ4NFpOWGLp8slf?si=Ht_VVUI0QkuXpi4zLDFX2w
appleUrl: https://podcasts.apple.com/us/podcast/the-web-talk-show/id1822997923?i=1000750217540
transcript: |
  **[00:00:00]**

  Hello everyone, my name is Armando Perez-Carreno and welcome to the Web Talk Show. Today with us is Ian Palmer Cook. He's SVP of AI at Clue. Welcome Ian. How are you? I am fantastic Armando. Thanks for having me. Oh, I'm very excited about this show because we're talking about AI and many other things specifically, but there's a lot to unpack in what you're an expert in. So, let's get to it. Tell us a little bit for a brief background for people who are listening. What do you do right now at Clue? What is Clue? And then also what's your background and how did you get there? Absolutely. So Clue (QLO) is a startup based in New York. I am the SVP of AI. The whole company does what I think of as predictive customer and cultural intelligence — figuring out what preferences people are going to have over a wide graph of particular objects. Starting from a brand of shoes, going to hotels, music artists, restaurants. Understanding what that cultural information is underneath all of those and putting together a picture of how people's tastes shape what they're interested in interacting with. We offer personalization and recommendation tools for business companies that are selling these things through apps, promotions, social media.

  **[00:02:00]**

  My background is the kind of machine learning, data science, statistics work that I started 15-16 years ago when I was doing a PhD. Since then I've moved through a number of startups — electricity market predictions to healthcare consumer packaged goods. Along the way I started building teams and building products. I've generally been guided by the idea that everything I want to build should show up in someone's hands so that they can use it. I love seeing the reaction and the interaction and how people put these tools to use. Did you ever when you were starting off doing statistical work and doing machine learning and traditional AI envision that we would be where we are now with Gen AI? No, I got a glimpse of it a few companies back when I was doing a lot of natural language processing. When we first got embeddings and the idea of putting all of this text in a usable space — there's this example from way back: king minus man plus woman equals queen. You could just say that at the terminal and get back queen. It just blew my mind. That's when I first got the sense that something really different was going on. But of course, I didn't then go on to build OpenAI, so clearly I only had a small image of what was coming. I never thought it would get this good this fast.

  **[00:04:00]**

  One of the best parts about what I do is having a great insight into what goes into all of it. Understanding not only does this feel really special, but knowing all of the work and the hard stuff that went behind it doesn't take away from the magic — it actually adds to it. Knowing what goes into it is a very good point. People very quickly take it for granted. It's building a whole application in 3 minutes, but then you're like, "No, I want it faster." We have this ratcheting thing in our brains — we find it startling at first and then it becomes natural, and then it's like, well, why isn't this better? The gap is always part of technology. The internet showed up and people wanted to buy everything through the internet right now. Eventually it got to the point where the idea that we can't buy something online is almost mind-blowing.

  **[00:06:00]**

  I remember back in 2007-2008 I used to build MPI clusters of computers for intelligent systems, but even then it was such a far-fetched thing for mainstream use. It was just people on the leading edge. Then the past 3-4 years there's been a definite inflection point. That's sort of why I like doing these shows — you start to get a behind-the-scenes look of everything. If you tell people everything that goes behind even just that statement of king minus man plus woman equals queen, there's so much behind it. The sheer amount of data, the clever work in statistics, the use of matrix algebra. I get a lot of people asking, should I still be learning to program? My answer is always yes. Not because programming is going to look the same — companies are saying we don't have humans touch code anymore. But understanding what goes into that and why it functions the way it does is a tremendous leg up. Even though we've got calculators, nobody says you shouldn't study math. Knowing what they are and what they're doing really ramps up understanding.

  **[00:08:00]**

  I tend to agree. You get two people in a room, both with an idea for an app. One just knows what they want it to do and the other also understands a little bit about software. They both go in and start prompting — the outcome of the one that knows a little bit is maybe 80% of the time going to be a lot more polished. It might do the same thing but it will cover aspects like hover effects, accessibility, authentication. If you start by telling it which libraries, which approach, which paradigm to use, it does a better job. It's like telling an intern to do something without explaining anything about the company. There's a movement talking about "outcome engineering" — just tell the tools what you want as an outcome. But people still think it's like "I want a great website." That's not quite enough. Anyone in software development can identify user stories, and you're going to get much better outcomes much faster.

  **[00:10:00]**

  I think of this as the ability to break down a problem in the language of the problem. One of the things I valued in getting a PhD was taking a problem with very loose definition and saying how do I get to some kind of solution. Breaking it down into manageable steps and then moving forward on those steps is one of the best skills I got. Problem solving — that's what I keep saying. You still need the person who knows how to break a problem into smaller parts or even explain a problem. And the tools can help — you can say "before you do anything, interview me" and then the tool will prompt you with questions. What do you think about that approach? I think it's fantastic. I'm part of an organization in Pittsburgh that's all about people putting AI to use at work. There's a great guy who talks constantly about how he's developed this interview skill for his AI agent. When he opens up something like Claude Code, he launches this interview skill and it asks: what is it you're trying to build, why are you trying to do it this way, what are the steps. That becomes the core of what you feed back and say "now go build this."

  **[00:12:00]**

  Have you incorporated that in your own workflow? Yes, I have. Especially when you get into the weeds building something — you get excited and want to plow through it. Claude starts doing it on its own. On platform 4.6, it'll sometimes stop and use its interview tool and start asking clarifying questions, which I think is great. But in other environments, I find myself telling it to interview me. It's really useful because we forget things — you might be at 80% of the process and realize you forgot something core. And then for the next time, I help prompt with decisions I made for the project so the LLM can go back and read why we went with this front-end framework, this database, this deployment system. What have you found with this group of people? Are they mostly excited about using AI at work? We have a group called AI at Work in Pittsburgh — AIORPGH.com. The people who show up are actively interested. The vast majority are actually using it at work. When we have meetings, you hear people bring how they're using it for marketing, legal operations, product management.

  **[00:14:00]**

  That said, one of our big discussions is how do we work with people who are much more skeptical. They have real concerns and great points. This is not like dealing with flat earth people — there's legitimate discussion about where to use it, when to use it, understanding guidelines. I would recommend this to anybody — just getting a group of people together to hear what are you facing, what are your challenges, what kind of tools are you using. We try to answer the interests of people who are slightly more technical and people who approach the world starting with a tool to answer a problem. How did the group come about? I can't claim the origination. Two people named Rex and Kit — they're fantastic "super connectors" in the Pittsburgh ecosystem. They realized the same thing you did and started it around the same time everybody was looking for community. We're lucky in Pittsburgh to have Carnegie Mellon University and the University of Pittsburgh. But we wanted to focus on professionals trying to put this to work. Kit and Rex put this together, I heard about it through connections, and now I'm actively participating in building the community.

  **[00:16:00]**

  That's amazing. It's like the Homebrew Computer Club. We have an active Slack community and amazing in-person events that we've had to grow because so many people want to be part of it. We have a whole channel in Slack for show and tell — what did you build. Some are crazy and some are just ingenious. And Carnegie Mellon — they had a big supercomputer using Mac Xserves back in the day. The University of Pittsburgh has the supercomputing center for high performance computing research. Now CMU is a place where big chip makers come to say, "Do you want access to our highest end systems?" because so many people coming out of CMU are leading researchers. We're at a place where media is making AI mainstream — you hear someone's dad or mom say "I made a video using AI." It's coming into regular everyday territory. And then things like OpenClaw come out and make it way easier for people to start interacting with the powerful versions of these tools.

  **[00:18:00]**

  Of course it brings potential issues, but if you follow the instructions carefully, the power is incredible. You could be on your phone at night, think of an idea, talk to the thing, have it build you an app overnight while you sleep, and wake up to see if it makes sense. It is a little bit addictive actually. I am fully on the OpenClaw train. I started when it was Claudbot, then Moldbot, now OpenClaw. I use this every day — back and forth with agents, interacting with email, calendar, scheduling things, figuring out what my day looks like, understanding project status. It has been tremendous. But it almost gets addictive. There was a study on Harvard Business Review about people using AI tools at work — it was supposed to free us up, but people feel more pressure. When they're not using it, they think "this agent is idle, I have tokens I'm not using." I think about it at night — I have this incredible power and I'm not using it. That pressure is a real sensation.

  **[00:20:00]**

  I know the feeling. It doesn't happen to everyone, but it does happen to first movers. You don't want to get left behind because everyone in your space is moving fast, but the rest of the world is completely unaware. Here's my point of view: I love software development because of the problem solving — the alchemy of having an idea and coding it into existence. Having a tool I can talk to that does all that is amazing. I think what's happening psychologically is that when you're building software, you have this wave of joy, then after a few months it starts decaying — the honeymoon period. What's happening now is it's so fast that you stay in the honeymoon period. You're able to finish something and launch it within that same high. You start and then you finish but you're still on the hype. That's what becomes addictive. I thought you were going to say the honeymoon period is shorter because you can think of a new project and move on — you chase that initial "I have a great idea" hit. My particular dopamine hit is agent skills. I can say there's something I wish I could just ask an agent to do and build a skill for it. I've made a little skills marketplace focused on Pittsburgh.

  **[00:22:00]**

  Now it knows things about the city, transit, things going on. I can ask quickly without it searching the web and confusing Pittsburgh, Pennsylvania with Pittsburgh, California. These skills are quick little hits — the idea to build something and release it very quickly. I do want to preface for people listening: skills are amazing but one has to have caution. Some people have malicious intent. There were marketplaces where someone put in what seemed like a Reddit scraper or Twitter scraper, very popular, but it had a nefarious purpose — expose API keys and things like that. As tools get better, they'll have better locks. But for now, people should be careful.

  **[00:24:00]**

  When the MCP stuff came out, the joke went around that "the S in MCP stands for security." Authorization through MCP is getting much better. Skills right now have none of that. Is this thing asking for remote code execution? Is it looking to increase permissions? That's a terrific point. One of the things though is you can build skills entirely for yourself — Claude Code has a skill builder tool. The reason I share them is just "hey, maybe you didn't think about this." But skills you build yourself, you can trust. You could also read someone else's skill — have your agent read it, not install it, just explain what it's doing. Skills can run code, which makes people think it supersedes MCP. A lot of mine have little Python snippets calling API endpoints. I can look at that and say it's calling an endpoint, not sending my API key anywhere. My own site has a submission process — it checks for malicious code and permissions escalation, and I read through it to make sure it's something I want on my marketplace.

  **[00:26:00]**

  Within this — we're talking to an agent, it feels like talking to a person, but it's not AGI. It's not even close. It's just a loop using very high-end models. Do you see AGI as the future? I am admittedly an AGI skeptic. I don't think we're going to have it anytime soon. We don't have a great understanding of human intelligence. We have various definitions. I'm never going to be a math researcher — that's not my natural talent. But there might be things I'm better at than Terence Tao. Who's to say which one of us is more intelligent? AGI is recursive on that. Even the most recent papers define AGI as "performs tasks comparable to average human intelligence." I'm not sure what that is. The most cynical definition is from OpenAI — hundred billion dollars in sales. That's when the Microsoft ownership and profit sharing is rescinded.

  **[00:28:00]**

  My guess is sometime probably next year, one of these labs will declare they've reached AGI. That turns into a scare tactic that keeps people from wanting to engage. "We're going to have AGI in a year and nobody's going to need jobs." I don't think it does any favors except for people building valuation for their startup. There'll be displacement, jobs that change dramatically. Some good, some very rough. I really want us as a society to grapple with what's about to come. But declaring AGI is a distracting sci-fi concept. If AGI is coming, it's not going to be just LLMs. It's not going to be just because it's incredibly good at typing the next token.

  **[00:30:00]**

  Can you explain in complete layman's terms how an LLM works? At its root it is a prediction machine that says, given what I have been told, what sounds like the most plausible next word. Complete this phrase: "Peanut butter and..." Most people say jelly. Think about Halloween — "peanut butter and..." most people say chocolate, because Reese's peanut butter cups. Think of Elvis — "peanut butter and..." banana, because that was Elvis's favorite sandwich. All those things I gave you is context. Within context, the next right word changes. Without context, peanut butter and jelly. With Halloween context, chocolate. With Elvis context, banana. The LLM is doing that — filling in that blank based on things it knows. It has an incredibly long list of words that come up next, some more or less likely depending on what's come before. That is all it's doing, over and over again.

  **[00:32:00]**

  That's not to say the context and information is not incredibly complicated. How it processes it, how you train the model — it's fascinating work, terrific advances in science and technology. But under the hood, it's just saying what is the next most likely token. People are blown away — they thought it was an intelligent being inside the machine. This is why it can't do math. Models score well on the International Math Olympiad — those are logic problems using sophisticated logic. But often it can't do simple arithmetic. Has it seen 1 + 1 = 2 a huge number of times? Yes. Pick some random longer numbers and ask it to divide them — the chance it's seen that combination is much lower. Companies are doing clever things — it doesn't know how to do math, so it switches into building a little Python script to do the addition.

  **[00:34:00]**

  It's like vector stores — people got very excited. You give it access to a document and say "do we cover this in this insurance policy" and it might do well. But if you ask "what is the PSI for part number X2F5G" — it will not find it because it's never seen that identifier in natural language. That's why intelligent document processing is still such a hard problem. Medical records are notoriously complex. I'm constantly seeing companies like LangChain, LlamaIndex, or Google say "we've got a new one, best on the market for parsing PDFs" — because it's not a solved problem.

  **[00:36:00]**

  There are clever approaches — hybrid search with free text and vector search, reranking, context expansion. It's good but it still doesn't really know. Companies are adding tools — it doesn't know how to do it, so it builds a Python script and gets back to you. I've worked with companies building prototypes pulling things out of insurance documents. Use a little Python program to add up itemized items, compare to what the LLM pulled from the summary table. If those are different, that's a great flag that the system didn't grab the right things. Using small tools is a terrific way to prevent LLM errors.

  **[00:38:00]**

  There's so much to unpack. Seeing it come down to regular everyday business — the electrician and plumber can now use these tools. If I had a services company needing scheduling — me and four other electricians, who is where when — I would adopt this immediately. Somebody has an immediate plumbing need on the east side, your guy is already there — just thinking about efficiencies you might not think about in the middle of work. It democratizes it — Walmart has been doing machine learning for a long time. But now everyone can use these tools.

  **[00:40:00]**

  Fun fact: the number one thing shipped to companies for big storms like hurricanes is strawberry Pop-Tarts. Sales are through the roof. You don't actually have to cook them, they last forever on the shelf. There's a great company called Seek at seekinsights.com that does this kind of analysis for storms. I suggest following them — they post tons of interesting things on LinkedIn. It has been a true pleasure talking. Where can people reach you? Easiest thing, go to my website: fiercehighways.ai (plural). I also post a bunch on LinkedIn, though I try not to make it all broetry and toxic positivity. One of the big things I like to admit is failure — it's the best teacher. Find me at either of those places and I'd love to hear from anybody. Amazing. I'll put those links in the show notes. Thank you so much for coming and for anyone listening, we'll see you in the next one.
---

## Show Notes

Ian Cook, SVP of AI at Clue (QLO), joins Armando for a deep dive into the reality behind AI hype. With a background spanning 15+ years of machine learning, data science, and multiple startups, Ian brings a refreshingly grounded perspective to the conversation — from how LLMs actually work at their core (spoiler: it's all about predicting the next word) to why he's skeptical about AGI claims.

The conversation covers practical ground too: why learning to program still matters even when AI writes code, how "outcome engineering" requires real problem decomposition skills, and why the interview-your-AI-before-building approach produces dramatically better results. Ian shares insights from running the AI at Work community in Pittsburgh (AIORPGH.com), where professionals across industries share how they're actually putting AI tools to use — from marketing to legal operations.

They also dig into the addictive nature of AI-powered development, the security realities of agent skills and MCP, why intelligent document processing remains unsolved, and how AI tools are democratizing capabilities that were previously reserved for enterprises like Walmart. Plus, you'll learn why strawberry Pop-Tarts fly off shelves before hurricanes.

## Topics Covered

- **How LLMs Actually Work** — Ian's peanut butter analogy breaks down token prediction in the simplest terms possible
- **AGI Skepticism** — Why AGI definitions are recursive, and OpenAI's cynical "hundred billion in sales" benchmark
- **Problem Decomposition** — Why the ability to break down problems matters more than coding syntax in the AI era
- **The Interview Approach** — Having AI interview you before building produces dramatically better outcomes
- **Agent Skills & Security** — The benefits and real risks of skill marketplaces, MCP security gaps, and how to stay safe
- **AI at Work Communities** — How Pittsburgh's AIORPGH group brings professionals together to share real-world AI usage
- **The Addiction Factor** — Why AI-powered development keeps you in the "honeymoon period" and the pressure that creates
- **Document Processing** — Why parsing PDFs and extracting structured data remains an unsolved problem

## Links Mentioned

- [Clue (QLO)](https://www.clue.com) — Predictive customer and cultural intelligence
- [Fierce Highways](https://fiercehighways.ai) — Ian Cook's website and skills marketplace
- [AI at Work Pittsburgh](https://aiorpgh.com) — Professional AI community in Pittsburgh
- [Seek Insights](https://seekinsights.com) — Storm and consumer behavior analytics
- [OpenClaw](https://openclaw.ai) — AI agent platform
