"use server";
import axios from "axios";

const getOptions = (text) => ({
  method: "POST",
  url: "https://tldrthis.p.rapidapi.com/v1/model/extractive/summarize-text/",
  headers: {
    "content-type": "application/json",
    "X-RapidAPI-Key": process.env.NEXT_PUBLIC_RAPIDAPI_KEY,
    "X-RapidAPI-Host": process.env.NEXT_PUBLIC_RAPIDAPI_HOST,
  },
  data: {
    text: text,
    num_sentences: 2,
  },
});

// Check useage: https://rapidapi.com/developer/billing/subscriptions-and-usage
export async function getTLDR(plainContent) {
  try {
    const res = await axios.request(getOptions(plainContent));
    const { summary } = res.data;
    return summary.join(" ");
  } catch (error) {
    console.log(error);
    return null;
  }
}
