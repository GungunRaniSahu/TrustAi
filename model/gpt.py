from openai import OpenAI

client = OpenAI(
    base_url="https://api.aimlapi.com/v1",
    api_key="fec7afa05f9f4884b07b00ad266b6203",    
)

with open("file.html", "r", encoding="utf-8") as file:
    html_content = file.read()

custom_prompt = "give me all the customer reviews from this file in 128000 tokens "

response = client.chat.completions.create(
    model="gpt-4o",
    messages = [
    {"role": "user", "content": f"{custom_prompt}\n\nHTML Content:\n{html_content}"}
]
)

print(response.choices[0].message.content)