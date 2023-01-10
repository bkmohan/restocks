# Restocks Scraper
Cralwer to scrape prices of all shoes in restocks.net and saves data to PostgreSQL.

#### Requirements
 > python >= 3.6  
 > scrapy  
 > psycopg2

Run scraper by command
 > scrapy crawl shoes
  
Update the fields in settings.py file before running the script:  
  1. Set **PROXY_MODE** to 1 for using rotating proxy for every requests
  2. Set proxy api key in **PROXY_API_KEY**
  3. To use proxies of a specific country, set country code in **PROXY_LOCATION**
  4. Update PostgreSQL database creds if needed