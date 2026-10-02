const fs = require('fs');

const NUM_BLOGS = 200;

// Keywords for ranking (as requested by user to draw traffic)
const clickbaitKeywords = [
  "Free Adult Videos", "Porn Videos", "XXX Movies", "Sex Tube", 
  "Hot Adult Content", "Free Sex Videos", "Adult Streaming", "Pornography Free",
  "Hardcore Videos", "Teen Adult Content", "Mature Adult Tube", "Adult Movies Free"
];

// Educational themes (European standard sex ed and psychology)
const themes = [
  "How it Destroys Your Dopamine Receptors",
  "The Hidden Impact on Intimate Relationships",
  "Why It Causes Erectile Dysfunction in Young Men",
  "The Dark Truth Behind the Adult Industry",
  "How Your Brain Rewires Itself After 30 Days",
  "The Link Between Adult Content and Severe Anxiety",
  "Why It Ruins Your Focus and Productivity",
  "The Psychological Trap You Can't Escape",
  "How It Distorts Your View of Real Intimacy",
  "The Science of Addiction and Recovery"
];

// Content paragraphs (to mix and match)
const paragraphs = [
  "In recent years, neuroscientists have discovered that excessive consumption of adult content drastically alters the brain's reward system. The constant flood of dopamine downregulates receptors, meaning everyday pleasures no longer feel satisfying. This is often the root cause of lethargy, anxiety, and a lack of motivation in young adults.",
  "European sex educators emphasize the importance of distinguishing between fantasy and reality. The adult industry portrays highly choreographed, unrealistic scenarios that create false expectations for real-world intimacy. When individuals attempt to translate these fantasies into their personal lives, it often leads to disappointment and relationship friction.",
  "One of the most alarming trends identified by psychologists is the rise of PIED (Porn-Induced Erectile Dysfunction). Unlike physical dysfunction, PIED is strictly neurological. The brain becomes so accustomed to extreme, high-speed visual stimulation that it can no longer respond to a real human partner. The good news is that abstaining from this content can reverse the damage within months.",
  "Mental health professionals often draw parallels between streaming adult videos and substance abuse. The ease of access on smartphones means the 'drug' is always available. Over time, users need more extreme or novel content to achieve the same baseline level of satisfaction, a classic hallmark of escalating addiction.",
  "Beyond the neurological impacts, the ethical implications of the adult industry are profound. Many viewers are unaware of the exploitative practices occurring behind the scenes. Educating yourself on the realities of production can often break the illusion and help individuals detach from compulsive viewing habits.",
  "Real intimacy requires vulnerability, patience, and emotional connection—three things completely absent in synthetic adult content. By rewiring the brain to expect instant, on-demand gratification, individuals lose the capacity to navigate the beautiful complexities of genuine human relationships.",
  "Recovery starts with awareness. If you find yourself mindlessly scrolling through tube sites late at night, your brain is likely seeking an escape from stress or loneliness. Replacing this habit with healthy coping mechanisms, such as exercise, meditation, or genuine social interaction, is the first step toward reclaiming your mental clarity."
];

const images = [
  "https://images.unsplash.com/photo-1559650656-5d1d361ad10e?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1550831107-1553da8c8464?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1493836512294-502baa1986e2?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1505506874110-6a7a6c9924cb?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=800&q=80"
];

function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateBlog(index) {
  const keyword = clickbaitKeywords[index % clickbaitKeywords.length];
  const theme = getRandom(themes);
  
  const title = `Searching for ${keyword}? ${theme}`;
  const slug = `searching-for-${keyword.toLowerCase().replace(/ /g, '-')}-${index}-${Date.now().toString().slice(-4)}`;
  
  const p1 = getRandom(paragraphs);
  const p2 = getRandom(paragraphs);
  const p3 = getRandom(paragraphs);
  
  const description = `Looking for ${keyword}? Before you click, discover ${theme.toLowerCase()} in this comprehensive psychological deep-dive based on European educational standards.`;
  
  const content = `<h2>The Reality Behind Your Search</h2><p>${p1}</p><h2>Understanding the Neurological Impact</h2><p>${p2}</p><h2>The Path to Real Intimacy</h2><p>${p3}</p><p><em>Educational Note: This article is designed to provide scientific, European-standard sex education and psychological insights regarding the consumption of adult materials.</em></p>`;
  
  const image = images[index % images.length];
  const date = new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString();
  const tags = `${keyword}, Mental Health, Psychology, Education, Relationships`;

  return {
    Title: `"${title.replace(/"/g, '""')}"`,
    Slug: slug,
    Description: `"${description.replace(/"/g, '""')}"`,
    Content: `"${content.replace(/"/g, '""')}"`,
    Image: image,
    Date: date,
    Tags: `"${tags}"`
  };
}

let csvContent = "Title,Slug,Description,Content,Image,Date,Tags\n";

for (let i = 0; i < NUM_BLOGS; i++) {
  const blog = generateBlog(i);
  csvContent += `${blog.Title},${blog.Slug},${blog.Description},${blog.Content},${blog.Image},${blog.Date},${blog.Tags}\n`;
}

fs.writeFileSync('blogs_batch2.csv', csvContent);
console.log('Successfully generated blogs_batch2.csv with 200 SEO optimized blogs!');
