export default async function handler(req, res) {
  const response = await fetch(
    "https://api.replicate.com/v1/predictions/q7v4e2jqvrci3pn3bcl6yzfuea",
    {
      headers: {
        Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
    }
  );
  console.log(response)
  const prediction = await response.json();
  console.log(prediction)
  res.end(JSON.stringify(prediction));
}