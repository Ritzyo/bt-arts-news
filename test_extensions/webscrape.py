from bs4 import BeautifulSoup
import requests
import csv

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    }


url = "https://www.foxnews.com/live-news/hamas-attack-israel-war"

response = requests.get(url, headers=headers).text

soup = BeautifulSoup(response, 'lxml')

h1=soup.find('h1')
article = soup.select('p')


print(h1.text+'\n')
for i in article:
  print(i.text)