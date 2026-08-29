#!/usr/bin/env python3
"""
InspectPractice — Reddit Auto-Poster (CloakBrowser)
================================================
Usage: python3 reddit_post.py [post_number]
  post_number: 1-5 (see posts below), default=1

Requires: pip install cloakbrowser
Run from HOME (résidentiel IP) — Reddit bloque les IPs datacenter.
"""

import sys, time, json, os
from cloakbrowser import launch

# ─── CREDENTIALS ─────────────────────────────────────────────
REDDIT_USER = "inspectpractice"
REDDIT_PASS = "!!WhyIamsucc3ss!!"

# ─── POSTS ───────────────────────────────────────────────────
POSTS = [
    {  # 0 = Post 1 — Community Discussion: Study Resources
        "subreddit": "aviationmaintenance",
        "title": "What study resources actually worked for your Transport Canada AME exams?",
        "body": """Starting my M1 prep and honestly feeling overwhelmed by how much material there is. CARs, TP14038E, Aircraft Tech Manuals — it's a lot. I'm curious what actually worked for people who've written the exams already.

Did you find the Transport Canada study guides helpful? Were there any question banks or apps that mirrored the real exam well? I've heard mixed things about the official prep materials — some say they're way easier than the actual test, some say they're the only thing you need.

Also, any resources that were total garbage and not worth the money? Would love to save some cash and avoid the scams.""",
    },
    {  # 1 = Post 2 — Value Share: Free Tool
        "subreddit": "aviationmaintenance",
        "title": "I built a free AI-powered AME practice exam tool — here's what I learned from 2,500+ questions",
        "body": """Spent the last few months building a free AME practice exam tool as a side project (I'm an apprentice mechanic who got tired of bad study resources). Launched it quietly and now have over 2,500 questions across M1, M2, E, S, and TP14038E.

A few things I learned from the data:

1. The hardest module across the board isn't theory of flight — it's CARs Standard 571 (maintenance releases). Pass rate on those questions is under 50%.
2. Most people can't answer aircraft hardware identification questions even though they're basic M1 material. Bolts, rivets, AN fittings — people freeze on visual ID.
3. The average user improves from 58% to 74% after 200 practice questions. The jump after 500 is insane.
4. TP14038E questions about human factors (fatigue, error chains) are the most commonly flagged as "tricky" — users say the wording is really different from the study material.

The tool is at inspectpractice.com if anyone wants to try it. It's free for the basic question banks. No email required to start. Not trying to sell anything — I genuinely built this because I couldn't find decent TC-specific practice questions and figured others might have the same problem.

Curious what you all think — what's missing? What do you wish existed?""",
    },
    {  # 2 = Post 3 — Career Discussion: Licence Paths
        "subreddit": "AircraftMechanics",
        "title": "M1 vs M2 vs E vs S — which AME licence path did you choose and why?",
        "body": """I'm about to start my apprenticeship and trying to decide which direction to go. The school I'm at offers pathways for all four and I keep going back and forth.

M1 seems like the most common starting point — small aircraft, helicopters, good variety of work. But the pay ceiling seems lower unless you're on heavy turbines.
M2 is where the airline money is but you're mostly doing A-checks and line maintenance on one or two types.
E (Avionics) is interesting to me because everything is moving toward glass cockpits and automation, but I've heard it's harder to find apprentice spots.
S (Structures) seems like a niche that's in crazy demand but the work can be seasonal depending on the shop.

If you could go back, would you pick the same licence? What do you wish you'd known before choosing? And for anyone who's dual-licensed — was the extra cert worth the time?""",
    },
    {  # 3 = Post 4 — Helpful Guide: CARs Standard 571
        "subreddit": "aviationmaintenance",
        "title": "Struggling with CARs Standard 571 references? Here's how I learned to navigate them",
        "body": """Standard 571 (Maintenance and Manufacturing) is probably the most referenced CARs section in the AME exams. It's also the most intimidating because it covers everything from flight authority to defect deferral to maintenance schedules.

Here's what helped me make sense of it:

571.01–571.04: Scope and definitions. Memorize 571.01(1) — it defines what "maintenance" actually means in regulatory context. This is the foundation of every maintenance release question.

571.06–571.08: Flight authority. 571.06 covers when you need a maintenance release before flight. 571.08 covers the actual flight authority document. These three paragraphs account for probably 12-15% of M1 questions.

571.10 – Defect deferral: Know the difference between Categories A, B, C, D. Category A means no dispatch (ground the aircraft). Category D means you've got 120 hours to fix it. This is a guaranteed exam question.

571.11 – Maintenance schedules: This is where the 50/100-hour and annual inspection requirements live. Know which schedule applies to which aircraft type.

My method: I printed out 571.01–571.14, highlighted every "shall" statement, and turned them into flash cards. 80% of exam questions on 571 are just rewording those "shall" statements and asking if you know which paragraph they belong to.

What's your strategy for memorizing CARs references? Anyone found a better system?""",
    },
    {  # 4 = Post 5 — Personal Story: TP14038E
        "subreddit": "aviationmaintenance",
        "title": "TP14038E exam was way harder than I expected — here's what actually helped",
        "body": """Wrote TP14038E last week and honestly went in overconfident. I'd studied the textbook, made flashcards, felt ready. The exam humbled me fast.

A few things that caught me off guard:
- Way more human factors questions than I expected. Fatigue models (Sleep-Wake Cycle, Circadian Rhythm disruption), error classification (Skill-based vs Rule-based vs Knowledge-based errors), and SHELL model analysis questions were heavy.
- The electrical fundamentals section was more applied than theoretical. They didn't ask "what is Ohm's law" — they gave me a circuit diagram with a fault and asked which component failed.
- The questions on maintenance error chains were worded deviously. You had to read each scenario three times to catch which barrier failed.

What saved me: Two weeks before the exam I switched to doing only practice questions instead of re-reading. I found a platform (InspectPractice) that had 400+ TP14038E-specific questions and the phrasing was much closer to the real exam than the textbook. Did about 50 questions a night for 14 days. Passed with 78%.

Biggest lesson: the textbook teaches you concepts. Practice questions teach you how Transport Canada asks about those concepts. They're different skills.

Anyone else find TP14038E harder than expected? What threw you off?""",
    },
]


# ─── POSTING LOGIC ───────────────────────────────────────────

def post_to_reddit(post_idx: int):
    post = POSTS[post_idx]
    sub = post["subreddit"]
    title = post["title"]
    body = post["body"]

    print(f"\n🚀 Posting to r/{sub}: \"{title[:60]}...\"")

    browser = launch(headless=False, humanize=True, timeout=30000)
    page = browser.new_page()
    page.set_default_timeout(20000)

    try:
        # Step 1: Login via old.reddit.com (simpler form)
        print("→ Logging in...")
        page.goto("https://old.reddit.com/login", wait_until="domcontentloaded")
        time.sleep(2)

        # Fill login form
        page.fill("input[name='user']", REDDIT_USER)
        page.fill("input[name='passwd']", REDDIT_PASS)
        page.click("button[type='submit']")
        time.sleep(4)

        # Check if login succeeded
        current_url = page.evaluate("window.location.href")
        print(f"→ After login URL: {current_url}")

        if "login" in current_url.lower():
            print("❌ Login failed — check credentials")
            page.screenshot(path="/tmp/reddit_login_fail.png", full_page=True)
            return False

        print("✅ Login OK")

        # Step 2: Navigate to submit page
        submit_url = f"https://old.reddit.com/r/{sub}/submit"
        print(f"→ Navigating to {submit_url}")
        page.goto(submit_url, wait_until="domcontentloaded")
        time.sleep(3)

        # Step 3: Fill title
        print(f"→ Filling title...")
        page.fill("input[name='title']", title)
        time.sleep(1)

        # Step 4: Fill body text
        print(f"→ Filling body text...")
        page.fill("textarea[name='text']", body)
        time.sleep(1)

        # Step 5: Submit
        print(f"→ Submitting...")
        # Check if there's a submit button
        submit_btn = page.query_selector("button[name='submit']")
        if submit_btn:
            submit_btn.click()
        else:
            # Try the submit button with type='submit'
            page.click("button[type='submit']")

        time.sleep(5)

        # Check result
        final_url = page.evaluate("window.location.href")
        print(f"→ Final URL: {final_url}")

        if "comments" in final_url or "submit" not in final_url:
            print(f"✅ Post submitted successfully!")
            page.screenshot(path="/tmp/reddit_post_success.png", full_page=True)
            return True
        else:
            print(f"⚠️ May have failed — still on submit page")
            page.screenshot(path="/tmp/reddit_post_fail.png", full_page=True)
            # Try to check for errors
            body_text = page.evaluate("document.body.innerText")
            print(f"Page text: {body_text[:500]}")
            return False

    except Exception as e:
        print(f"❌ Error: {e}")
        page.screenshot(path="/tmp/reddit_post_error.png", full_page=True)
        return False
    finally:
        browser.close()


# ─── MAIN ─────────────────────────────────────────────────────

if __name__ == "__main__":
    # Parse post number from CLI arg
    post_num = 1
    if len(sys.argv) > 1:
        try:
            post_num = int(sys.argv[1])
        except ValueError:
            print(f"Usage: python3 reddit_post.py [1-5]")
            sys.exit(1)

    if post_num < 1 or post_num > len(POSTS):
        print(f"Post number must be between 1 and {len(POSTS)}")
        sys.exit(1)

    idx = post_num - 1
    success = post_to_reddit(idx)

    if success:
        print(f"\n🎉 Post #{post_num} published to r/{POSTS[idx]['subreddit']}!")
    else:
        print(f"\n❌ Post #{post_num} failed. Check /tmp/reddit_*.png for screenshots.")
