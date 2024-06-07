addEventListener('scheduled', event => {
  event.waitUntil(handleScheduled(event));
});

async function handleScheduled(event) {
  // Discord webhook URL (store this in environment variables for security)
  const webhookUrl = 'https://discord.com/api/webhooks/1243227062135951474/IwGtozbba6-mAt1cZ_sxXgT2fwjtr-J_3HCwS50q7PPgohpiSxTquifOhH7Q5HTs63X9';

  try {
    // Fetch a random quote
    const quoteResponse = await fetch('https://api.quotable.io/random');
    const quoteData = await quoteResponse.json();
    const quote = quoteData.content;

    // Make a GET request to retrieve a random image
    const imageUrlResponse = await fetch('https://source.unsplash.com/random/1920x1080');
    const imageUrl = imageUrlResponse.url;

    // Fetch weather data
    const weatherResponse = await fetch('https://api.open-meteo.com/v1/forecast?latitude=35.6944,37.2761,36.2981,52.5244,43.7001,49.2497&longitude=51.4215,49.5886,59.6057,13.4105,-79.4163,-123.1193&current=temperature_2m,is_day&timezone=auto');
    const weatherData = await weatherResponse.json();

    const timeResponse = await fetch('https://api.keybit.ir/time');
    const timeData = await timeResponse.json();

    // Extracting necessary data
    const jalaliDate = timeData.date.full.official.iso.en;
    const gregorianDate = timeData.date.other.gregorian.iso.en;
    const ghamariDate = timeData.date.other.ghamari.iso.en;
    let dayEvent = "No event for today";

    if (timeData.date.day.events.local) {
      dayEvent = `Local Event: ${timeData.date.day.events.local.text}`;
    } else if (timeData.date.day.events.global) {
      dayEvent = `Global Event: ${timeData.date.day.events.global.text}`;
    } else if (timeData.date.day.events.holy) {
      dayEvent = `Holy Event: ${timeData.date.day.events.holy.text}`;
    }

    // Embedded message payload
    const payload = {
      embeds: [
        {
          title: "Good morning folks 🙂",
          description: `**Jalali Date:** ${jalaliDate}\n**Gregorian Date:** ${gregorianDate}\n**Ghamari Date:** ${ghamariDate}\n**Day Event:** ${dayEvent}`,
          fields: [
            {
              "name": "⛅ Tehran, Iran:",
              "value": `${weatherData[0].current.temperature_2m}°C, ${weatherData[0].current.is_day ? 'Day' : 'Night'}`,
              "inline": true
            },
            {
              "name": "⛅ Rasht, Iran:",
              "value": `${weatherData[1].current.temperature_2m}°C, ${weatherData[1].current.is_day ? 'Day' : 'Night'}`,
              "inline": true
            },
            {
              "name": "⛅ Mashhad, Iran:",
              "value": `${weatherData[2].current.temperature_2m}°C, ${weatherData[2].current.is_day ? 'Day' : 'Night'}`,
              "inline": true
            },
            {
              "name": "⛅ Berlin, Germany:",
              "value": `${weatherData[3].current.temperature_2m}°C, ${weatherData[3].current.is_day ? 'Day' : 'Night'}`,
              "inline": true
            },
            {
              "name": "⛅ Toronto, Canada:",
              "value": `${weatherData[4].current.temperature_2m}°C, ${weatherData[4].current.is_day ? 'Day' : 'Night'}`,
              "inline": true
            },
            {
              "name": "⛅ Vancouver, Canada:",
              "value": `${weatherData[5].current.temperature_2m}°C, ${weatherData[5].current.is_day ? 'Day' : 'Night'}`,
              "inline": true
            },
            {
              name: "Hey, check out this quote! Falling in love needs action :)",
              value: quote,
              inline: true
            }
          ],
          image: {
            url: imageUrl // Use the retrieved image URL
          },
          color: parseInt("00b0f4", 16), // Convert hex color to decimal
          footer: {
            text: "CFW SkyCanvas Coded by ArmanLeader",
            icon_url: "https://avatars.githubusercontent.com/u/128156131?v=4&size=40"
          },
          timestamp: new Date().toISOString()
        }
      ]
    };

    // Fetch options for the POST request
    const fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    };

    // Send POST request to the Discord webhook
    const response = await fetch(webhookUrl, fetchOptions);

    // Return the response from the fetch request
    if (response.ok) {
      return new Response('Embedded message sent to Discord successfully!', { status: 200 });
    } else {
      return new Response('Failed to send embedded message to Discord.', { status: response.status });
    }
  } catch (error) {
    return new Response('Error occurred while sending embedded message to Discord.', { status: 500 });
  }
}
