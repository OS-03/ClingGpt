import "dotenv/config";

const getOpenAIAPIResponse = async (message) => {
  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "provider-3/gpt-4o-mini",
      messages: [{ role: "user", content: message }],
    }),
  };
  try {
    const response = await fetch(
      "https://api.a4f.co/v1/chat/completions",
      options
    );
    const data = await response.json();
    return data.choices[0].message.content;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export default getOpenAIAPIResponse;
