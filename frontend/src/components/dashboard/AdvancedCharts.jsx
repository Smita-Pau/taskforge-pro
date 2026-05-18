import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';

export function VelocityChart({ data }) {
  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
          <defs>
            <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.15}/>
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorAdded" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.3} />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 600}} 
            dy={15} 
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 600}} 
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'hsl(var(--surface-high))', 
              borderColor: 'hsl(var(--border) / 0.5)', 
              borderRadius: '12px', 
              fontSize: '12px',
              fontWeight: '600',
              boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.5)',
              border: '1px solid hsla(var(--border) / 0.5)'
            }}
            itemStyle={{ color: 'hsl(var(--foreground))' }}
            cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1, strokeDasharray: '4 4' }}
          />
          <Area type="monotone" dataKey="completed" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorCompleted)" />
          <Area type="monotone" dataKey="added" stroke="hsl(var(--muted-foreground))" strokeWidth={2} strokeDasharray="5 5" fillOpacity={1} fill="url(#colorAdded)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function DistributionChart({ data }) {
  const COLORS = {
    'Done': 'hsl(var(--primary))',
    'Progress': 'hsla(var(--primary) / 0.7)',
    'Review': 'hsla(var(--primary) / 0.5)',
    'Todo': 'hsla(var(--primary) / 0.3)',
    'Blocked': 'hsl(var(--destructive))'
  };
  
  return (
    <div className="w-full h-full flex justify-center items-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie 
            data={data} 
            innerRadius={75} 
            outerRadius={95} 
            paddingAngle={4} 
            dataKey="value" 
            stroke="none"
            animationDuration={1500}
            animationBegin={0}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[entry.name] || 'hsl(var(--muted))'} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'hsl(var(--surface-high))', 
              borderRadius: '12px', 
              border: '1px solid hsl(var(--border) / 0.5)',
              fontSize: '12px',
              fontWeight: '600',
              boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.5)'
            }} 
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CapacityChart({ data }) {
  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 0, right: 0, left: -30, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.2} />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 600}} dy={10} />
          <Tooltip 
            cursor={{fill: 'hsl(var(--muted))', opacity: 0.1}} 
            contentStyle={{ 
              backgroundColor: 'hsl(var(--surface-high))', 
              borderRadius: '12px', 
              border: '1px solid hsl(var(--border) / 0.5)',
              fontSize: '12px',
              fontWeight: '600',
              boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.5)'
            }} 
          />
          <Bar dataKey="tasks" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} barSize={32} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
