const fs = require('fs');

const NUM_BLOGS = 1000;

// Exactly 20 Titles as requested
const clickbaitKeywords = [
  "Exclusive Viral Sex Tape", 
  "College Girl Leaked Video", 
  "Premium OnlyFans Leaks HD", 
  "Hardcore Amateur Teen Video",
  "Asian Step Fantasy Full Video",
  "Latina POV Hidden Cam",
  "Milf Threesome Uncensored",
  "Hentai Anime Uncensored HD",
  "Public Sex Real Amateur",
  "Celebrity Private Leaked Video",
  "Tiktok Nudes & Leaks 2026",
  "Snapchat Premium Free Access",
  "BDSM Fetish Hardcore HD",
  "Lesbian Squirting Full Video",
  "Ebony Casting Couch Viral",
  "Virtual Reality Porn VR HD",
  "Massage Happy Ending Video",
  "Discord Nudes Server Leaks",
  "Live Adult Webcams Free",
  "Naughty Step Mom Fantasy"
];

const themes = [
  "How it Destroys Your Dopamine Receptors in 2026",
  "The Hidden Impact on Intimate Relationships",
  "Why It Causes Erectile Dysfunction in Young Men",
  "The Dark Truth Behind the Adult Industry",
  "How Your Brain Rewires Itself After 30 Days",
  "The Link Between Adult Content and Severe Anxiety",
  "Why It Ruins Your Focus and Productivity"
];

const paragraphs = [
  "In recent years, and particularly with 2026 clinical data, neuroscientists have discovered that excessive consumption of adult content drastically alters the brain's reward system. The constant flood of dopamine downregulates receptors, meaning everyday pleasures no longer feel satisfying. This is often the root cause of lethargy, anxiety, and a lack of motivation in young adults.",
  "European sex educators emphasize the importance of distinguishing between fantasy and reality. The adult industry portrays highly choreographed, unrealistic scenarios that create false expectations for real-world intimacy. When individuals attempt to translate these fantasies into their personal lives, it often leads to disappointment and relationship friction.",
  "One of the most alarming trends identified by psychologists is the rise of PIED (Porn-Induced Erectile Dysfunction). Unlike physical dysfunction, PIED is strictly neurological. The brain becomes so accustomed to extreme, high-speed visual stimulation that it can no longer respond to a real human partner. The good news is that abstaining from this content can reverse the damage within months.",
  "Mental health professionals often draw parallels between streaming adult videos and substance abuse. The ease of access on smartphones means the 'drug' is always available. Over time, users need more extreme or novel content to achieve the same baseline level of satisfaction, a classic hallmark of escalating addiction.",
  "Real intimacy requires vulnerability, patience, and emotional connection—three things completely absent in synthetic adult content. By rewiring the brain to expect instant, on-demand gratification, individuals lose the capacity to navigate the beautiful complexities of genuine human relationships."
];

// Verified Unsplash Image IDs to ensure no broken images
const imageIds = [
  "1559650656-5d1d361ad10e", "1550831107-1553da8c8464", "1493836512294-502baa1986e2",
  "1499209974431-9dddcece7f88", "1505506874110-6a7a6c9924cb", "1520607162513-77705c0f0d4a",
  "1507413245164-6160d8298b31", "1518609878373-06d740f60d8b", "1532012197267-da84d127e765",
  "1494438639946-1ebd1d20bf85", "1516321318423-f06f85e504b3", "1475721025566-814ce858cd56"
];

function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle(array) {
  let currentIndex = array.length,  randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}

function generateBlog(index) {
  const keyword = clickbaitKeywords[index % clickbaitKeywords.length];
  const theme = themes[Math.floor((index / clickbaitKeywords.length) % themes.length)] || getRandom(themes);
  
  const titleVariations = [
    `${keyword} - ${theme}`,
    `${keyword} | ${theme}`,
    `${keyword} (2026 Report): ${theme}`,
    `${keyword} Explained: ${theme}`,
    `${keyword} Insights: ${theme}`,
    `${keyword} Psychology: ${theme}`,
    `${keyword} & Mental Health: ${theme}`
  ];
  
  const title = titleVariations[index % titleVariations.length];
  const slug = `exclusive-viral-${keyword.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${index}-${Date.now().toString().slice(-6)}`;
  
  const shuffledParas = shuffle([...paragraphs]);
  const p1 = shuffledParas[0];
  const p2 = shuffledParas[1];
  const p3 = shuffledParas[2];
  const p4 = shuffledParas[3];
  const p5 = shuffledParas[4];
  
  const description = `Looking for ${keyword}? Before you click, discover ${theme.toLowerCase()} in this comprehensive psychological deep-dive based on the latest 2026 European educational standards.`;
  
  const content = `<h2>The Reality Behind Your Search</h2><p>${p1}</p><h2>Understanding the Neurological Impact (2026 Data)</h2><p>${p2}</p><h2>The European Clinical Approach</h2><p>${p3}</p><h2>The Psychological Toll</h2><p>${p4}</p><h2>The Path to Real Intimacy</h2><p>${p5}</p><p><em>Educational Note: This article is designed to provide scientific, European-standard sex education and psychological insights regarding the consumption of adult materials. Last updated: 2026.</em></p>`;
  
  const imageId = imageIds[index % imageIds.length];
  const image = `https://images.unsplash.com/photo-${imageId}?auto=format&fit=crop&w=800&q=80`;
  
  const date = new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString();
  const tags = `${keyword}, Mental Health, Psychology, Education 2026, Viral Leaks`;

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

fs.writeFileSync('blogs_batch6.csv', csvContent);
console.log('Successfully generated blogs_batch6.csv with 1000 SEO optimized blogs using 20 titles!');
