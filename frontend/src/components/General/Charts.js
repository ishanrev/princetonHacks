// import "./styles.css";
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../contexts";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";


function BarChartComp() {

  const { user } = useContext(UserContext);
  /**  const data = [
  //   {
  //     name: "Page A",
  //     uv: 4000,
  //     pv: 2400,
  //     amt: 2400
  //   },
  //   {
  //     name: "Page B",
  //     uv: 3000,
  //     pv: 1398,
  //     amt: 2210
  //   },
  //   {
  //     name: "Page C",
  //     uv: 2000,
  //     pv: 9800,
  //     amt: 2290
  //   },
  //   {
  //     name: "Page D",
  //     uv: 2780,
  //     pv: 3908,
  //     amt: 2000
  //   },
  //   {
  //     name: "Page E",
  //     uv: 1890,
  //     pv: 4800,
  //     amt: 2181
  //   },
  //   {
  //     name: "Page F",
  //     uv: 2390,
  //     pv: 3800,
  //     amt: 2500
  //   },
  //   {
  //     name: "Page G",
  //     uv: 3490,
  //     pv: 4300,
  //     amt: 2100
  //   },
  // ];
  */

  /** {
      name: "Page A",
      uv: 4000,
      pv: 2400,
      amt: 2400
    } */
  const [data, setData] = useState([{}, {}, {}, {}, {}, {}, {}])
  // user.dailyProgress.forEach((day, index) => {
  //   data.push({
  //     name: `Day ${index + 1}`,
  //     // score: day.pointsCollected,
  //     score: day.pointsCollected,
  //     num: day.questionsCompleted

  //   })
  // })

  useEffect(() => {
    let tempData = [];
    let index = 0;
    for (let x = user.dailyProgress.length - 7; x < user.dailyProgress.length; x++) {
      let day = user.dailyProgress[x];
      tempData.push({
        name: `Day ${index + 1}`,
        // score: day.pointsCollected,
        // score: day.pointsCollected,
        score: Math.floor(Math.random() * 10),
        num: day.questionsCompleted

      })
      index += 1;
    }
    setData(tempData)
  }, [])
  return (
    <div className="max-w-[3rem] pt-8">

      <BarChart
        width={600}
        height={150}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5
        }}
      >
        {/* <CartesianGrid strokeDasharray="3 3" /> */}
        <XAxis hide dataKey="name" />
        <YAxis />
        <Tooltip />
        {/* <Legend /> */}
        <Bar dataKey="score" fill="#92BA9280" radius={[5, 5, 3, 3]} />
        {/* <Bar dataKey="uv" fill="#82ca9d" /> */}
      </BarChart>
    </div>
  );
}

export {
  BarChartComp
}
