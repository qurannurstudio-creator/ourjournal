import urllib.request
import re
import random

urls = []
pages = 5
for page in range(1, pages + 1):
    try:
        url = f"https://unsplash.com/napi/search/photos?query=football%20match&per_page=30&page={page}"
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response:
            html = response.read().decode('utf-8')
            # Extract IDs using regex from the JSON response
            import json
            data = json.loads(html)
            for result in data.get('results', []):
                urls.append(f"https://images.unsplash.com/photo-{result['id']}?auto=format&fit=crop&w=800&q=80")
    except Exception as e:
        print("Error:", e)

for page in range(1, pages + 1):
    try:
        url = f"https://unsplash.com/napi/search/photos?query=tennis%20match&per_page=30&page={page}"
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response:
            html = response.read().decode('utf-8')
            import json
            data = json.loads(html)
            for result in data.get('results', []):
                urls.append(f"https://images.unsplash.com/photo-{result['id']}?auto=format&fit=crop&w=800&q=80")
    except Exception as e:
        pass

for page in range(1, pages + 1):
    try:
        url = f"https://unsplash.com/napi/search/photos?query=stadium&per_page=30&page={page}"
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response:
            html = response.read().decode('utf-8')
            import json
            data = json.loads(html)
            for result in data.get('results', []):
                urls.append(f"https://images.unsplash.com/photo-{result['id']}?auto=format&fit=crop&w=800&q=80")
    except Exception as e:
        pass

print(f"Found {len(urls)} unique images.")
# write them to file
random.shuffle(urls)
final_urls = (urls * 10)[:500]  # repeat if necessary to reach 500
with open("unsplash_images.txt", "w") as f:
    f.write("\n".join(final_urls))
