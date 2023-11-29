from transformers import pipeline
from bs4 import BeautifulSoup
import requests
import csv

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    }


url = "https://www.foxbusiness.com/media/disneys-wish-flops-thanksgiving-weekend-following-series-box-office-disappointments-2023"

response = requests.get(url, headers=headers).text

soup = BeautifulSoup(response, 'lxml')

h1=soup.find('h1')
article = soup.select('p')

title = h1.text
texts = ''
for i in article:
  texts+=i.text
  print(i.text)

summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

ARTICLE = texts
result = summarizer(ARTICLE, max_length=800, min_length=30, do_sample=False)
print(result)

