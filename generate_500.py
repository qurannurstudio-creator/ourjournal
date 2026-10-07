import random
import urllib.parse

sports = [
    ("UEFA Champions League", "football"),
    ("English Premier League", "football"),
    ("La Liga Matchday", "football"),
    ("Serie A Derby", "football"),
    ("Bundesliga Clash", "football"),
    ("Formula 1 Grand Prix", "motorsport"),
    ("Wimbledon Championship", "tennis"),
    ("Roland Garros (French Open)", "tennis"),
    ("Six Nations Rugby", "rugby"),
    ("Tour de France Stage", "cycling"),
    ("EuroLeague Basketball", "basketball"),
    ("European Athletics Championships", "athletics"),
    ("MotoGP European Round", "motorsport"),
    ("EHF Champions League", "handball")
]

locations = [
    "London, UK", "Paris, France", "Madrid, Spain", "Barcelona, Spain", "Rome, Italy", 
    "Berlin, Germany", "Munich, Germany", "Milan, Italy", "Monaco", "Amsterdam, Netherlands",
    "Lisbon, Portugal", "Vienna, Austria", "Athens, Greece", "Dublin, Ireland", "Brussels, Belgium"
]

adjectives = ["thrilling", "highly anticipated", "epic", "unforgettable", "massive", "action-packed", "crucial", "breathtaking", "intense", "historic"]
seo_phrases = [
    "Secure your tickets and check the full schedule.",
    "Stay tuned for live updates, highlights, and ticket information.",
    "Don't miss out on this spectacular European sports event.",
    "Find the latest tournament news, live streams, and match details.",
    "Experience top-tier competition and unforgettable moments.",
    "A must-watch for all sports enthusiasts and fans across Europe.",
    "Check out the ultimate guide to this upcoming championship clash."
]

bodies = []
images = []

for i in range(1, 501):
    event, sport = random.choice(sports)
    location = random.choice(locations)
    adj = random.choice(adjectives)
    seo = random.choice(seo_phrases)
    
    body = f"Get ready for a {adj} {event} taking place in {location}! As one of the premier upcoming {sport} events in Europe, this showcase promises world-class talent and non-stop excitement. {seo}"
    
    prompt = f"{event} {sport} in {location} europe high quality photography"
    encoded_prompt = urllib.parse.quote(prompt)
    image_url = f"https://image.pollinations.ai/prompt/{encoded_prompt}?seed={i}&width=800&height=600&nologo=true"
    
    bodies.append(body)
    images.append(image_url)

with open("bodies.txt", "w", encoding="utf-8") as f:
    f.write("\n".join(bodies))

with open("images.txt", "w", encoding="utf-8") as f:
    f.write("\n".join(images))

print("Generated 500 events.")
