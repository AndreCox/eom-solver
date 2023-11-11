import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import styles from "../styles/Home.module.css";
import { use, useEffect, useState } from "react";
import eomSolver from "../math/eomsolver";
import { State } from "../math/eomsolver";
import { evaluate } from "mathjs";
import Fraction from "fraction.js";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement);

export default function Home() {
  const [step, setStep] = useState(0.1);
  const [timeRange, setTimeRange] = useState([0, 10]);

  const [xCoef, setXCoef] = useState(1);
  const [vCoef, setVCoef] = useState(1);
  const [aCoef, setACoef] = useState(1);

  const [x, setX] = useState(1);
  const [v, setV] = useState(1);

  const [equals, setEquals] = useState("0");

  const [history, setHistory] = useState<number[][]>([]);

  const polyMorphicEom = (
    t: number,
    x: number,
    v: number
  ): number | undefined => {
    // this function changes the equation of motion based on the input
    // we want to use the mathjs library to parse the equation based on the input
    // first take equals and replace the t with the t passed in
    const parsedEquation = equals.replace("t", t.toString());

    // then we convert the string using mathjs
    try {
      evaluate(parsedEquation);
    } catch (e) {
      // if the equation is invalid, return undefined
      return undefined;
    }
    const equation = evaluate(parsedEquation);
    // if equation is undefined, return undefined
    if (equation === undefined) {
      return undefined;
    }

    // now the equation looks like this
    // coef1 * a + coef2 * v + coef3 * x = value
    // we want to return the value of a
    return (equation - vCoef * v - xCoef * x) / aCoef;
  };

  useEffect(() => {
    let history: number[][] = [];

    history = eomSolver(
      polyMorphicEom,
      {
        x,
        v,
      },
      {
        start: timeRange[0],
        end: timeRange[1],
      },
      step
    );

    setHistory(history);
  }, [step, timeRange, equals, xCoef, vCoef, aCoef, x, v]);

  return (
    <div className="p-[0 2rem]">
      <Head>
        <title>EOM Solver</title>
        <meta name="description" content="Generated with next-template" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen p-4 flex flex-1 flex-col justify-center items-center text-4xl">
        <h1 className="text-5xl font-bold bg-gradient-to-bl from-orange-500 to-pink-500 text-transparent bg-clip-text">
          EOM Solver
        </h1>
        <p className="text-2xl text-center text-white">
          A tool for solving equations of motion for a rigid body
        </p>

        <div className="flex flex-row gap-12 justify-center mt-12">
          <div className="flex flex-col space-y-2">
            <div className="w-full justify-center flex flex-row">
              <span className="text-white text-lg">Step Size</span>
            </div>
            <input
              type="range"
              onChange={(e) => {
                setStep(parseFloat(e.target.value));
              }}
              step={0.01}
              max={1}
              min={0.01}
              value={step}
            />
            <input
              type="number"
              className="bg-transparent  text-center text-white"
              value={step}
              step={0.01}
              max={1}
              min={0.01}
              onChange={(e) => {
                setStep(parseFloat(e.target.value));
              }}
            />
          </div>
          <div className="flex flex-col space-y-2">
            <div className="w-full justify-center flex flex-row">
              <span className="text-white text-lg">Time Min</span>
            </div>
            <input
              type="range"
              className=""
              onChange={(e) => {
                // check if the value is greater than the max
                if (parseFloat(e.target.value) > timeRange[1]) {
                  setTimeRange([timeRange[1], timeRange[1]]);
                  return;
                }
                setTimeRange([parseFloat(e.target.value), timeRange[1]]);
              }}
              step={1}
              max={150}
              min={0}
              value={timeRange[0]}
            />

            <input
              type="number"
              className="bg-transparent text-center text-white"
              value={timeRange[0]}
              step={1}
              max={150}
              min={0}
              onChange={(e) => {
                // check if the value is greater than the max
                if (parseFloat(e.target.value) > timeRange[1]) {
                  setTimeRange([timeRange[1], timeRange[1]]);
                  return;
                }
                setTimeRange([parseFloat(e.target.value), timeRange[1]]);
              }}
            />
          </div>
          <div className="flex flex-col space-y-2">
            <div className="w-full justify-center flex flex-row">
              <span className="text-white text-lg">Time Max</span>
            </div>
            <input
              type="range"
              className=""
              onChange={(e) => {
                // check if the value is greater than the max
                if (parseFloat(e.target.value) < timeRange[0]) {
                  setTimeRange([timeRange[0], timeRange[0]]);
                  return;
                }
                setTimeRange([timeRange[0], parseFloat(e.target.value)]);
              }}
              step={1}
              max={150}
              min={0}
              value={timeRange[1]}
            />

            <input
              type="number"
              className="bg-transparent text-center text-white"
              value={timeRange[1]}
              step={1}
              max={150}
              min={0}
              onChange={(e) => {
                // check if the value is greater than the max
                if (parseFloat(e.target.value) < timeRange[0]) {
                  setTimeRange([timeRange[0], timeRange[0]]);
                  return;
                }
                setTimeRange([timeRange[0], parseFloat(e.target.value)]);
              }}
            />
          </div>
        </div>
        <div className="flex flex-col justify-center">
          <span className="text-white text-3xl pt-6 text-center">
            Initial Conditions
          </span>
          <div className="flex flex-row justify-center pt-4">
            <span className="text-white">
              &#7818; ={" "}
              <input
                type="number"
                className=" bg-zinc-800 p-1 px-2 rounded-xl text-white box-border w-20 mx-2"
                value={v}
                onChange={(e) => {
                  setV(parseFloat(e.target.value));
                }}
              />
              X ={" "}
              <input
                type="number"
                className=" bg-zinc-800 p-1 px-2 rounded-xl text-white box-border w-20 mx-2"
                value={x}
                onChange={(e) => {
                  setX(parseFloat(e.target.value));
                }}
              />
            </span>
          </div>
        </div>
        <div className="flex flex-row justify-center">
          {/* we want to add the equation in the form x dot dot + x dot + x = value */}
          {/* it the values should be editiable */}

          <div className="flex flex-col space-y-2">
            <div className="w-full justify-center flex flex-col pt-12 pb-6">
              <span className="text-white text-3xl text-center">
                Equation of motion
              </span>
              <div className="flex flex-row justify-center"></div>
            </div>
            <span className="text-white text-center align-text-top h-full ">
              {/* we want to add an input below that fits to the size of the entered text */}
              <input
                type="number"
                className=" bg-zinc-800 p-1 px-2 rounded-xl text-white box-border w-20 mx-2"
                value={aCoef}
                onChange={(e) => {
                  setACoef(parseFloat(e.target.value));
                }}
              />
              &#7820; +
              <input
                type="number"
                className=" bg-zinc-800 p-1 px-2 rounded-xl text-white box-border w-20 mx-2"
                value={vCoef}
                onChange={(e) => {
                  setVCoef(parseFloat(e.target.value));
                }}
              />
              &#7818; +
              <input
                type="number"
                className=" bg-zinc-800 p-1 px-2 rounded-xl text-white box-border w-20 mx-2"
                value={xCoef}
                onChange={(e) => {
                  setXCoef(parseFloat(e.target.value));
                }}
              />
              X =
              <input
                type="text"
                className=" bg-zinc-800 p-1 px-2 rounded-xl text-white box-border w-48 mx-2"
                value={equals}
                onChange={(e) => {
                  setEquals(e.target.value);
                }}
              />
            </span>
          </div>
        </div>
        <Line
          className="max-w-5xl max-h-96"
          data={{
            labels: history.map((value) => value[0]),
            datasets: [
              {
                label: "EOM Equation",
                data: history.map((value) => value[1]),
                fill: false,
                borderColor: "rgb(75, 192, 192)",
                tension: 0.1,
              },
            ],
          }}
          options={{
            scales: {
              y: {
                title: {
                  display: true,
                  text: "Position",
                  color: "white",
                },
              },
              x: {
                title: {
                  display: true,
                  text: "Time",
                  color: "white",
                },
              },
            },
            animation: {
              duration: 100,
              easing: "linear",
            },
          }}
        />
      </main>
    </div>
  );
}
