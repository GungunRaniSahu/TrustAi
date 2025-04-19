import requests
from bs4 import BeautifulSoup

url = "https://www.casekidukaan.com/rich-black-glossy-glass-case-for-iphone-xr?srsltid=AfmBOoor3Up4PC7qOoSKlUIsA1Pu-PnAI4TKO7VfOwrosofnJlBRZ2BSRzs"
r = requests.get(url)


soup = BeautifulSoup(r.text, "html.parser")

for tag in soup(["script", "style"]):
    tag.decompose()


clean_text = soup.get_text(separator="\n", strip=True)


with open("file.html", "w", encoding="utf-8") as f:
    f.write(str(soup)) 
with open("plain_text.txt", "w", encoding="utf-8") as f:
    f.write(clean_text)
