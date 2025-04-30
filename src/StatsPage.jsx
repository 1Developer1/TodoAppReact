import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
// Redux hook'unu ekliyoruz
import { useSelector } from 'react-redux';

const StatsPage = () => {
  // Redux state'inden todoları çekiyoruz - artık useLocation'a ihtiyacımız yok
  const todos = useSelector(state => state.todos);
   
  // Grafik verilerini oluşturma
  const chartData = [
    { name: 'Completed', value: todos.filter(todo => todo.completed).length },
    { name: 'Pending', value: todos.filter(todo => !todo.completed).length }
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ textAlign: 'center' }}>📊 Todo Status Chart (with Redux)</h2>
      {todos.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <p style={{ textAlign: 'center' }}>No todo data available</p>
      )}
    </div>
  );
};

export default StatsPage;