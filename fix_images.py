import csv

with open("bodies.txt", "r", encoding="utf-8") as f:
    bodies = f.read().splitlines()

images = [f"https://picsum.photos/seed/euro_event_{i}/800/600" for i in range(1, 501)]

with open("europe_sports_events_500.csv", "w", encoding="utf-8", newline="") as f:
    writer = csv.writer(f)
    writer.writerow(["Body", "Image URL"])
    for b, i in zip(bodies, images):
        writer.writerow([b, i])

with open("images.txt", "w", encoding="utf-8") as f:
    f.write("\n".join(images))

print("Fixed images.")
