import AgentRoute from "../../../routes/AgentRoute";
import AssignedCustomers from "../AssignedCustomers/AssignedCustomers";

const AgentDashboard = () => {
  return (
    <AgentRoute>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Dashboard Header */}
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Agent Dashboard
        </h1>

        {/* Assigned Customers Section */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Assigned Customers
          </h2>
          <AssignedCustomers />
        </div>
      </div>
    </AgentRoute>
  );
};

export default AgentDashboard;
