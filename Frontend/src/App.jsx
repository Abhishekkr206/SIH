import React, { useState, useEffect } from 'react';
import { MapPin, Car, AlertTriangle, Settings } from 'lucide-react';

const TrafficDashboard = () => {
  const [activeSection, setActiveSection] = useState('Live Map');
  const [trafficLights, setTrafficLights] = useState([
    { id: 'TL1', x: 200, y: 150, state: 'red', timer: 45, lane: 'North' },
    { id: 'TL2', x: 300, y: 150, state: 'green', timer: 30, lane: 'South' },
    { id: 'TL3', x: 250, y: 100, state: 'yellow', timer: 5, lane: 'East' },
    { id: 'TL4', x: 250, y: 200, state: 'red', timer: 20, lane: 'West' }
  ]);
  
  const [hoveredLight, setHoveredLight] = useState(null);
  
  const updateTimer = (lightId, change) => {
    setTrafficLights(prev => prev.map(light => 
      light.id === lightId 
        ? { ...light, timer: Math.max(1, light.timer + change) }
        : light
    ));
  };

  // Update traffic lights every 30 seconds (more realistic)
  useEffect(() => {
    const updateLights = () => {
      setTrafficLights(prev => prev.map(light => ({
        ...light,
        timer: light.timer > 0 ? light.timer - 1 : Math.floor(Math.random() * 60) + 15,
        state: light.timer <= 0 ? 
          (light.state === 'red' ? 'green' : 
           light.state === 'green' ? 'yellow' : 'red') : light.state
      })));
    };

    const interval = setInterval(updateLights, 1000);
    return () => clearInterval(interval);
  }, []);

  const sidebarItems = [
    { name: 'Live Map', icon: MapPin },
    { name: 'Junction Stats', icon: Car },
    { name: 'Alerts', icon: AlertTriangle },
    { name: 'Settings', icon: Settings }
  ];

  const getTrafficLightColor = (state) => {
    switch(state) {
      case 'red': return '#ef4444';
      case 'yellow': return '#f59e0b';
      case 'green': return '#10b981';
      default: return '#6b7280';
    }
  };

  const MapSection = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6 h-120">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">4-Lane Junction - Live View</h3>
        <div className="relative w-full h-90 bg-gray-100 rounded-lg overflow-hidden">
          <svg width="100%" height="100%" viewBox="0 0 500 300">
            {/* 4-Lane Roads */}
            <g stroke="#374151" strokeWidth="8" fill="none">
              {/* Horizontal road */}
              <line x1="0" y1="150" x2="500" y2="150" />
              {/* Vertical road */}
              <line x1="250" y1="0" x2="250" y2="300" />
            </g>
            
            {/* Road markings (dashed lines) */}
            <g stroke="#ffffff" strokeWidth="2" strokeDasharray="10,5" fill="none">
              {/* Horizontal center line */}
              <line x1="0" y1="150" x2="500" y2="150" />
              {/* Vertical center line */}
              <line x1="250" y1="0" x2="250" y2="300" />
            </g>

            {/* Lane dividers */}
            <g stroke="#ffffff" strokeWidth="1" strokeDasharray="5,5" fill="none">
              {/* Horizontal lanes */}
              <line x1="0" y1="130" x2="220" y2="130" />
              <line x1="280" y1="130" x2="500" y2="130" />
              <line x1="0" y1="170" x2="220" y2="170" />
              <line x1="280" y1="170" x2="500" y2="170" />
              
              {/* Vertical lanes */}
              <line x1="230" y1="0" x2="230" y2="120" />
              <line x1="270" y1="0" x2="270" y2="120" />
              <line x1="230" y1="180" x2="230" y2="300" />
              <line x1="270" y1="180" x2="270" y2="300" />
            </g>

            {/* Junction area */}
            <rect x="220" y="120" width="60" height="60" fill="#4b5563" opacity="0.3" />

            {/* Traffic Lights */}
            {trafficLights.map(light => (
              <g key={light.id}>
                {/* Traffic light pole */}
                <rect x={light.x - 2} y={light.y - 20} width="4" height="20" fill="#374151" />
                
                {/* Traffic light box */}
                <rect 
                  x={light.x - 8} 
                  y={light.y - 25} 
                  width="16" 
                  height="12" 
                  fill="#1f2937" 
                  rx="2"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredLight(light)}
                  onMouseLeave={() => setHoveredLight(null)}
                />
                
                {/* Traffic light */}
                <circle 
                  cx={light.x} 
                  cy={light.y - 19} 
                  r="5" 
                  fill={getTrafficLightColor(light.state)}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredLight(light)}
                  onMouseLeave={() => setHoveredLight(null)}
                />

                {/* Lane label */}
                <text 
                  x={light.x} 
                  y={light.y + 15} 
                  textAnchor="middle" 
                  className="text-xs fill-gray-600 font-semibold"
                >
                  {light.lane}
                </text>
              </g>
            ))}

            {/* Hover tooltip */}
            {hoveredLight && (
              <g>
                <rect 
                  x={hoveredLight.x + 15} 
                  y={hoveredLight.y - 50} 
                  width="120" 
                  height="45" 
                  fill="rgba(0,0,0,0.9)" 
                  rx="6"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="1"
                />
                <text 
                  x={hoveredLight.x + 25} 
                  y={hoveredLight.y - 35} 
                  className="text-sm fill-white font-bold"
                >
                  {hoveredLight.lane} Lane
                </text>
                <text 
                  x={hoveredLight.x + 25} 
                  y={hoveredLight.y - 22} 
                  className="text-sm fill-yellow-300 font-medium"
                >
                  {hoveredLight.state.toUpperCase()}
                </text>
                <text 
                  x={hoveredLight.x + 25} 
                  y={hoveredLight.y - 10} 
                  className="text-sm fill-green-300 font-medium"
                >
                  Timer: {hoveredLight.timer}s
                </text>
              </g>
            )}
          </svg>
        </div>
      </div>

      {/* Control Panel */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Manual Timer Control</h3>
        <div className="grid grid-cols-2 gap-4">
          {trafficLights.map(light => (
            <div key={light.id} className="border rounded-lg p-4 bg-gray-50">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-800 flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: getTrafficLightColor(light.state) }}
                  />
                  {light.lane} Lane
                </h4>
                <span className="text-sm text-gray-600">{light.timer}s</span>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => updateTimer(light.id, -5)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm font-medium"
                >
                  -5s
                </button>
                <button 
                  onClick={() => updateTimer(light.id, -1)}
                  className="bg-red-400 hover:bg-red-500 text-white px-3 py-1 rounded text-sm"
                >
                  -1
                </button>
                <span className="text-lg font-bold text-gray-700 min-w-[3rem] text-center">
                  {light.timer}
                </span>
                <button 
                  onClick={() => updateTimer(light.id, 1)}
                  className="bg-green-400 hover:bg-green-500 text-white px-3 py-1 rounded text-sm"
                >
                  +1
                </button>
                <button 
                  onClick={() => updateTimer(light.id, 5)}
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm font-medium"
                >
                  +5s
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">
            💡 Click the buttons to manually adjust traffic light timers
          </p>
        </div>
      </div>
    </div>
  );

  const renderMainContent = () => {
    switch (activeSection) {
      case 'Live Map':
        return <MapSection />;
      
      case 'Junction Stats':
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-6 text-gray-800">Traffic Light Status</h3>
            <div className="grid grid-cols-2 gap-4">
              {trafficLights.map(light => (
                <div key={light.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-gray-800">{light.lane} Lane</h4>
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: getTrafficLightColor(light.state) }}
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Status: <span className="font-medium">{light.state.toUpperCase()}</span>
                  </p>
                  <p className="text-sm text-gray-600">Timer: {light.timer}s</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'Alerts':
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-6 text-gray-800">System Status</h3>
            <div className="space-y-4">
              <div className="p-4 rounded-lg border-l-4 bg-green-50 border-green-500">
                <p className="text-sm font-medium text-gray-800">All traffic lights operational</p>
                <p className="text-xs text-gray-500 mt-1">Last checked: 2 min ago</p>
              </div>
              <div className="p-4 rounded-lg border-l-4 bg-blue-50 border-blue-500">
                <p className="text-sm font-medium text-gray-800">Normal traffic flow detected</p>
                <p className="text-xs text-gray-500 mt-1">Updated: 1 min ago</p>
              </div>
            </div>
          </div>
        );

      case 'Settings':
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-6 text-gray-800">Junction Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Timer Update Interval</label>
                <select className="w-full p-2 border border-gray-300 rounded-md">
                  <option>1 second</option>
                  <option>5 seconds</option>
                  <option>10 seconds</option>
                </select>
              </div>
              <div>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" defaultChecked />
                  <span className="text-sm text-gray-700">Show traffic light timers</span>
                </label>
              </div>
            </div>
          </div>
        );

      default:
        return <MapSection />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b h-16 flex items-center px-6">
        <h1 className="text-xl font-bold text-gray-800">Smart Traffic Management Dashboard</h1>
        <div className="ml-auto flex items-center space-x-4">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-600">Live</span>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm h-screen sticky top-0">
          <nav className="p-4">
            <ul className="space-y-2">
              {sidebarItems.map((item) => (
                <li key={item.name}>
                  <button
                    onClick={() => setActiveSection(item.name)}
                    className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors ${
                      activeSection === item.name
                        ? 'bg-teal-50 text-teal-700 border-l-4 border-teal-500'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {renderMainContent()}
        </main>
      </div>
    </div>
  );
};

export default TrafficDashboard;