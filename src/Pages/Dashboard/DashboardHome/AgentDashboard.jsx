import AgentRoute from "../../../routes/AgentRoute";
import AssignedCustomers from "../AssignedCustomers/AssignedCustomers";


const AgentDashboard = () => {
  return (
    <AgentRoute>
      <div>
        <h1>Agent Dashboard</h1>
        <AssignedCustomers />
      </div>
    </AgentRoute>
  );
};

export default AgentDashboard;
