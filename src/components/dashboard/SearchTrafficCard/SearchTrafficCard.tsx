import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import Card from '../../ui/Card';
import { mockPieChartData } from '../../../data/dashboardData';
import styles from './SearchTrafficCard.module.css';

const COLORS = ['#6D5DF6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#3B82F6'];

const SearchTrafficCard: React.FC = () => {
  return (
    <Card title="Traffic by Category" subtitle="Distribution of views across blog categories">
      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={mockPieChartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
            >
              {mockPieChartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                background: '#071120', 
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                color: '#fff'
              }}
              itemStyle={{ color: '#fff' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className={styles.legend}>
        {mockPieChartData.map((entry, index) => (
          <div key={entry.name} className={styles.legendItem}>
            <span 
              className={styles.legendColor} 
              style={{ background: COLORS[index % COLORS.length] }} 
            />
            {entry.name}
          </div>
        ))}
      </div>
    </Card>
  );
};

export default SearchTrafficCard;
