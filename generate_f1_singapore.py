import csv
import random
import urllib.parse
from datetime import datetime, timedelta

def generate_csv():
    # Lists of SEO keywords and variations
    short_tails = [
        "Singapore GP Live Stream",
        "Watch F1 Singapore Free",
        "F1 Singapore 2026 Live",
        "Singapore Grand Prix Free Broadcast",
        "Stream F1 Live Today",
    ]
    
    long_tails = [
        "How to watch Formula 1 Singapore Grand Prix 2026 live stream free from anywhere",
        "Where to stream F1 Singapore qualifying live for free without cable",
        "Best free VPNs to watch Singapore Grand Prix 2026 live broadcast",
        "Singapore GP 2026: Time, schedule, and free live streaming links",
        "Watch Max Verstappen at Singapore Grand Prix 2026 free online",
        "Free channels broadcasting F1 Singapore Grand Prix live this weekend",
        "Ultimate guide to watching Formula 1 live streams for free in 2026",
    ]
    
    locations = ["USA", "UK", "Canada", "Australia", "India", "Europe", "Worldwide", "South Africa", "New Zealand", "Asia"]
    
    # Generate 200 posts
    posts = []
    
    # Base Date for scheduling (spread over the next 2 days)
    base_date = datetime(2026, 10, 7, 12, 0, 0)
    
    for i in range(1, 201):
        # Determine if this post is long-tail or short-tail focused
        is_long = random.choice([True, False])
        
        if is_long:
            base_title = random.choice(long_tails)
            title = f"{base_title} - {random.choice(locations)} Guide #{i}"
        else:
            base_title = random.choice(short_tails)
            title = f"{base_title} - Free Guide 2026 [{random.choice(locations)}] Part {i}"
            
        slug = f"{title.lower().replace(' ', '-').replace(':', '').replace(',', '').replace('[', '').replace(']', '').replace('#', '')}"
        
        description = f"Looking for a way to watch the 2026 Singapore Grand Prix? Here is the ultimate guide on how to catch every lap of the F1 race live and completely for free from {random.choice(locations)}."
        
        content = f"""<p>The 2026 Formula 1 season is heating up, and all eyes are on the spectacular Marina Bay Street Circuit for the <strong>Singapore Grand Prix</strong>. Fans around the world are eagerly searching for the best ways to catch the high-speed action under the lights.</p>

<h2>When is the 2026 Singapore Grand Prix?</h2>
<p>The race weekend kicks off on October 9th with practice sessions, followed by the highly anticipated qualifying on October 10th. The main race takes place on Sunday, October 11, 2026.</p>

<h2>How to Watch F1 Singapore Grand Prix 2026 for Free</h2>
<p>If you don't have a cable subscription, don't worry! Several international broadcasters offer free live streams of Formula 1 races. Channels like ServusTV and ORF in Austria, or RTBF in Belgium, are known for their free F1 coverage.</p>
<p>To access these from {random.choice(locations)}, you might need to use a reliable VPN. Simply connect your VPN to an Austrian or Belgian server, head over to the broadcaster's website, and enjoy the Singapore GP completely free of charge!</p>

<h3>Step-by-Step Guide:</h3>
<ol>
<li>Download and install a secure VPN.</li>
<li>Connect to a server in Austria (for ServusTV/ORF) or Belgium (for RTBF).</li>
<li>Visit the streaming platform and start watching the F1 live stream for free!</li>
</ol>
<p>Don't miss the thrilling night race as the drivers battle it out on one of the most challenging circuits on the calendar!</p>"""

        # Generate a relevant image URL using Pollinations AI
        prompt = f"Formula 1 race car speeding at night Singapore Marina Bay street circuit neon lights cinematic high quality"
        encoded_prompt = urllib.parse.quote(prompt)
        image = f"https://image.pollinations.ai/prompt/{encoded_prompt}?seed={i}&width=800&height=600&nologo=true"
        
        # Spread dates from today up to the race day
        post_date = base_date + timedelta(minutes=random.randint(1, 2880)) # Up to 48 hours (2 days)
        date_str = post_date.strftime("%Y-%m-%dT%H:%M:%SZ")
        
        tags = "F1, Singapore GP, Live Stream, Free, Formula 1, Motorsports"
        
        posts.append([title, slug, description, content, image, date_str, tags])

    # Write to CSV
    filename = "f1_singapore_2026.csv"
    with open(filename, "w", encoding="utf-8", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(["title", "slug", "description", "content", "image", "date", "tags"])
        writer.writerows(posts)
        
    print(f"Successfully generated {filename} with {len(posts)} posts.")

if __name__ == "__main__":
    generate_csv()
