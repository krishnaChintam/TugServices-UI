import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  CartesianGrid,
  Legend,
} from 'recharts';

const Dashboard = () => {
  // Quick stats data
  const stats = [
    { title: 'New Alerts', value: 27, color: 'green' },
    { title: 'New Messages', value: 10, color: 'blue' },
    { title: 'Overdue Tasks', value: 44, color: 'red' },
    { title: "Today's Appointments", value: '35%', color: 'orange' },
    { title: 'Interactive Communication', value: 10, color: 'blue' },
    { title: 'Care Plan', value: 'N/A', color: 'gray' },
  ];

  // Remote Patient Monitoring Bar Chart Data
  const monitoringData = [
    { month: 'Feb', In: 30, Out: 60 },
    { month: 'Mar', In: 35, Out: 65 },
    { month: 'Apr', In: 40, Out: 75 },
    { month: 'May', In: 42, Out: 72 },
    { month: 'Jun', In: 45, Out: 60 },
    { month: 'Jul', In: 44, Out: 70 },
  ];

  // KOS Score data (Donut chart)
  const kosData = [
    { name: 'KOS Score', value: 117 },
    { name: 'Remaining', value: 100 },
  ];

  // Time Tracking data (Donut chart: Male vs. Female)
  const timeTrackingData = [
    { name: 'Male', value: 86 },
    { name: 'Female', value: 70 },
  ];

  // Sensors data (Area chart)
  const sensorData = [
    { month: 'Feb', value: 130000 },
    { month: 'Mar', value: 135000 },
    { month: 'Apr', value: 140000 },
    { month: 'May', value: 145000 },
    { month: 'Jun', value: 142000 },
    { month: 'Jul', value: 148000 },
    { month: 'Aug', value: 150000 },
    { month: 'Sep', value: 149000 },
    { month: 'Oct', value: 153000 },
  ];

  // Patients by Division
  const divisions = [
    { division: 'Cardiology', pt: 85 },
    { division: 'Neurology', pt: 90 },
    { division: 'Surgery', pt: 65 },
    { division: 'Covid', pt: 21 },
    { division: 'General', pt: 89 },
    { division: 'Oncology', pt: 55 },
  ];

  // Colors for donut charts
  const donutColors = ['#8884d8', '#E2E8F0'];
  const timeColors = ['#FF6B6B', '#FFD93D'];

  return (
    <div className="flex-1 overflow-auto px-4 py-4">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-4">
        {stats.map(({ title, value, color }, idx) => (
          <div key={idx} className="bg-white shadow p-3 rounded-md">
            <h4 className="text-xs text-gray-500 truncate">{title}</h4>
            <div className="text-lg md:text-xl font-bold text-blue-900">{value}</div>
            <div className="mt-1 h-1 w-full bg-gray-200 rounded">
              <div
                className="h-full rounded"
                style={{ width: "60%", backgroundColor: color }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {/* Remote Patient Monitoring Bar Chart */}
        <div className="bg-white shadow p-3 rounded-md col-span-1 md:col-span-1 lg:col-span-2">
          <h4 className="text-sm mb-1 text-gray-600 font-semibold">
            Remote Patient Monitoring
          </h4>
          <ResponsiveContainer
            width="100%"
            height={window.innerWidth < 768 ? 180 : 250}
          >
            <BarChart
              data={monitoringData}
              margin={{ top: 5, right: 5, bottom: 5, left: 0 }}
            >
              <XAxis
                dataKey="month"
                tick={{ fontSize: window.innerWidth < 768 ? 10 : 12 }}
              />
              <YAxis
                tick={{ fontSize: window.innerWidth < 768 ? 10 : 12 }}
              />
              <Tooltip />
              <Bar dataKey="In" fill="#8884d8" />
              <Bar dataKey="Out" fill="#FF6B6B" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* KOS Score Donut Chart */}
        <div className="bg-white shadow p-3 rounded-md col-span-1">
          <h4 className="text-sm mb-1 text-gray-600 font-semibold">KOS Score</h4>
          <div className="flex justify-center items-center">
            <ResponsiveContainer
              width="100%"
              height={window.innerWidth < 768 ? 160 : 220}
            >
              <PieChart>
                <Pie
                  data={kosData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={window.innerWidth < 768 ? 40 : 60}
                  outerRadius={window.innerWidth < 768 ? 60 : 80}
                  stroke="none"
                  fill="#8884d8"
                  paddingAngle={2}
                >
                  {kosData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={donutColors[index % donutColors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="text-center font-bold text-xl text-blue-900">117</div>
        </div>

        {/* Time Tracking Donut Chart */}
        <div className="bg-white shadow p-3 rounded-md col-span-1">
          <h4 className="text-sm mb-1 text-gray-600 font-semibold">Time Tracking</h4>
          <div className="flex justify-center items-center">
            <ResponsiveContainer
              width="100%"
              height={window.innerWidth < 768 ? 160 : 220}
            >
              <PieChart>
                <Pie
                  data={timeTrackingData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={window.innerWidth < 768 ? 40 : 60}
                  outerRadius={window.innerWidth < 768 ? 60 : 80}
                  stroke="none"
                  fill="#8884d8"
                  paddingAngle={2}
                >
                  {timeTrackingData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={timeColors[index % timeColors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center space-x-4">
            {timeTrackingData.map((d, i) => (
              <div key={i} className="flex items-center space-x-1">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ background: timeColors[i] }}
                />
                <span className="text-xs text-gray-600">{d.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sensors Area Chart */}
        <div className="bg-white shadow p-3 rounded-md col-span-1 md:col-span-2">
          <h4 className="text-sm mb-1 text-gray-600 font-semibold">Sensors</h4>
          <ResponsiveContainer
            width="100%"
            height={window.innerWidth < 768 ? 160 : 220}
          >
            <AreaChart
              data={sensorData}
              margin={{ top: 5, right: 5, bottom: 5, left: 0 }}
            >
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: window.innerWidth < 768 ? 10 : 12 }}
              />
              <YAxis
                tick={{ fontSize: window.innerWidth < 768 ? 10 : 12 }}
              />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#8884d8"
                fillOpacity={1}
                fill="url(#colorValue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Patients By Division */}
        <div className="bg-white shadow p-3 rounded-md col-span-1 md:col-span-1 lg:col-span-2">
          <h4 className="text-sm mb-1 text-gray-600 font-semibold">
            Patients By Division
          </h4>
          <ul className="mt-1">
            {divisions.map((item, i) => (
              <li
                key={i}
                className="flex justify-between py-1.5 border-b last:border-b-0 text-sm text-gray-700"
              >
                <span>{item.division}</span>
                <span className="font-semibold">{item.pt}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
