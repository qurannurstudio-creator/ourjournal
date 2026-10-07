import csv

with open("bodies.txt", "r", encoding="utf-8") as f:
    bodies = f.read().splitlines()

with open("images.txt", "r", encoding="utf-8") as f:
    images = f.read().splitlines()

with open("europe_sports_events_500.csv", "w", encoding="utf-8", newline="") as f:
    writer = csv.writer(f)
    writer.writerow(["Body", "Image URL"])
    for b, i in zip(bodies, images):
        writer.writerow([b, i])

print("CSV generated.")
