import { BarChart, Bar, XAxis, YAxis, Label, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Statistic } from "../types/DataPoint";

interface Props {
  stats: Statistic[] | undefined,
  loading: boolean,
}

export default function Statistics({ stats, loading }: Props) {
  return (
    <div className='bg-sky-50 rounded-lg text-slate-800 py-3'>
      <div className='h-96'>
      {loading &&
        <div className="text-center h-full w-full flex items-center justify-center text-xl font-bold loading">Loading</div>
      }
      {!loading && stats &&
        <div className='px-3 py-1'>
          <ResponsiveContainer width="95%" height={360} >
            <BarChart
              data={stats}
              margin={{ top: 5, left: 5, right: 5, bottom: 10 }}
              >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="index">
                <Label
                  style={{
                      textAnchor: "middle",
                      fontSize: "100%",
                      fill: "#AAAEB0",
                  }}
                  angle={0}
                  offset={-5}
                  position="bottom"
                  value={"Categories of recommended articles"} />
              </XAxis>
              <YAxis>
              <Label
                style={{
                    textAnchor: "middle",
                    fontSize: "100%",
                    fill: "#AAAEB0",
                }}
                angle={270}
                value={"Number of recommended articles"} />
              </YAxis>
              <Tooltip />
              <Bar dataKey="cat" name="Number of recommended articles" fill="#075985" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      }
      </div>
    </div>
  );
}
