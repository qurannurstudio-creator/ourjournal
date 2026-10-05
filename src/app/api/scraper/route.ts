import { NextResponse } from 'next/server';

function extractSuggestions(data: any): string[] {
  // Amazon 2017 API format
  if (data && data.suggestions && Array.isArray(data.suggestions)) {
    return data.suggestions
      .map((item: any) => item.value)
      .filter((v: any) => typeof v === 'string');
  }
  
  // Generic Array format (like Google Autocomplete)
  if (Array.isArray(data)) {
    // Sometimes Google returns [ "query", [ "sugg1", "sugg2" ] ]
    if (data.length > 1 && Array.isArray(data[1])) {
      return data[1].filter((v: any) => typeof v === 'string' || (Array.isArray(v) && typeof v[0] === 'string')).map((v:any) => typeof v === 'string' ? v : v[0]);
    }
    return data.filter((v: any) => typeof v === 'string');
  }

  return [];
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { urlTemplate, seedKeywords, targetCount } = body;

    if (!urlTemplate || !seedKeywords || !Array.isArray(seedKeywords) || seedKeywords.length === 0) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const count = parseInt(targetCount, 10) || 50;
    const allKeywords = new Set<string>(seedKeywords);
    const keywordsToProcess = [...seedKeywords];

    let requestsMade = 0;
    const MAX_REQUESTS = 50; // hard limit to prevent infinite loops and timeouts

    while (keywordsToProcess.length > 0 && allKeywords.size < count && requestsMade < MAX_REQUESTS) {
      const currentKw = keywordsToProcess.shift();
      if (!currentKw) continue;

      const fetchUrl = urlTemplate.replace('{keyword}', encodeURIComponent(currentKw));
      
      try {
        const response = await fetch(fetchUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'application/json'
          },
          // Short timeout to avoid hanging
          signal: AbortSignal.timeout(5000)
        });

        if (response.ok) {
          const data = await response.json();
          const newSuggestions = extractSuggestions(data);

          for (const word of newSuggestions) {
            if (!allKeywords.has(word)) {
              allKeywords.add(word);
              keywordsToProcess.push(word);

              if (allKeywords.size >= count) {
                break;
              }
            }
          }
        }
      } catch (err) {
        console.error(`Error fetching data for ${currentKw}:`, err);
      }

      requestsMade++;
      
      // Delay to avoid rate limiting
      if (keywordsToProcess.length > 0 && allKeywords.size < count) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return NextResponse.json({
      keywords: Array.from(allKeywords)
    });
  } catch (error) {
    console.error('Scraper API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
