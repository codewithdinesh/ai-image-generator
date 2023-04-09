import { useState } from "react";
import Head from "next/head";
import Image from "next/image";

import { Header } from "@/components/Header";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default function Home() {
  const [prediction, setPrediction] = useState(null);
  const [result, setResult] = useState();
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("/api/predictions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: e.target.prompt.value,
      }),
    });
    let prediction = await response.json();
    if (response.status !== 201) {
      setError(prediction.detail);
      return;
    }
    setPrediction(prediction);

    while (
      prediction.status !== "succeeded" &&
      prediction.status !== "failed"
    ) {
      const response = await fetch("/api/predictions/" + prediction.id);
      prediction = await response.json();
      if (response.status !== 200) {
        setError(prediction.detail);

        return;
      }
      console.log({ prediction })
      setPrediction(prediction);
    }
  };

  return (
    <div className=" bg-white/50 p-2.5 shadow-lg backdrop-blur-lg dark:border-slate-600/60 dark:bg-slate-700/50 h-screen">

      <div className={"container  mx-auto p-5 pt-0 flex-col items-center "}>
        <Head>
          <title>AI Image Genearator</title>
        </Head>

        <p className=" text-sm text-center text-slate-300 p-1">
          AI Image Generator
        </p>

        <form className={"flex-1 flex p-5 py-1 "} onSubmit={handleSubmit}>
          <input type="text" name="prompt"
            placeholder="Enter a prompt to display an image"
            className="appearance-none block w-full bg-transparent text-gray-100 border border-gray-400 rounded py-3 px-4 mb-3 leading-tight focus:outline-none   focus:border-gray-500"
          />
          <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 mb-3  ml-1 border border-blue-700 rounded">Go!</button>
        </form>

        <Header />

        <div className="p-5 pt-0 pb-0">

          {/* 
          <div className=" max-w-sm mx-auto">
            <Image
              src={"https://replicate.delivery/pbxt/8EbYxAQ5LtL9NdFBR6U5TcH5rPDtVl7VvonQatVZdEhx3fXIA/out-0.png"}
              alt="output"
              width={500}
              height={500}
              className="w-full h-full rounded-lg"
            /> 
          </div>
          */}

          {error && <div className="text-sm text-center text-slate-300 p-1">{error}</div>}
          {prediction && (
            <div className="w-full p-5">
              <p className="text-sm text-center text-slate-300 p-1">Status: {prediction?.status}</p>
              {prediction.output && (
                <div className=" max-w-sm mx-auto">

                  <Image
                    src={prediction.output[prediction.output.length - 1]}
                    alt="output"
                    width={500}
                    height={500}
                    className="w-full h-full rounded-lg "
                  />
                </div>
              )}
            </div>
          )}
        </div>


      </div>
      <p className=" text-sm text-center text-slate-300 p-1">
        Made with ❤️ by @codewithdinesh
      </p>
    </div>

  );
}