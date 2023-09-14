import { PieChart, Pie, ResponsiveContainer, Tooltip } from 'recharts';
import { Article } from "../types/DataPoint"

interface Props {
    article: Article;
  }

const roundTwo = (num: number) => Math.round(num * 100) / 100;
export default function PieChartComponent({ article }: Props) {
    const pieData = [
        { name: 'Popularity', value: roundTwo(article.popularity_w) },
        { name: 'Content similarity', value: roundTwo(article.content_w) },
        { name: 'User similarity', value: roundTwo(article.users_w) },
    ]
    return (
        <ResponsiveContainer width="95%" height={300}>
            <PieChart width={730} height={250}>
            <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#075985" label />
            <Tooltip />
            </PieChart>
        </ResponsiveContainer>
    )
}