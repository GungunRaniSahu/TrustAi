from openai import OpenAI
from bs4 import BeautifulSoup

# Initialize OpenAI client
client = OpenAI(
    base_url="https://api.aimlapi.com/v1",
    api_key="fec7afa05f9f4884b07b00ad266b6203",
)

# Load and parse HTML
with open("file.html", "r", encoding="utf-8") as file:
    html_content = file.read()

soup = BeautifulSoup(html_content, "html.parser")

# ⬇️ Change this based on the class or tag used for customer reviews
reviews = soup.find_all(class_="review")  # Try replacing with actual class name if this doesn’t work

# Extract review texts
all_reviews = "\n\n".join([r.get_text(strip=True) for r in reviews])

# Optional: limit to first 30,000 characters
all_reviews = all_reviews[:30000]

# Ask GPT
custom_prompt = "Extract and summarize customer reviews from the following text."

response = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {"role": "user", "content": f"{custom_prompt}\n\n{all_reviews}"}
    ]
)

print(response.choices[0].message.content)
