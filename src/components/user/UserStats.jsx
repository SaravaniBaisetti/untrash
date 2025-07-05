const UserStats = () => {
  return (
    <div className="card p-4 mb-3 shadow">
      <h4 className="text-success">🌱 Your Impact</h4>
      <ul className="list-group list-group-flush mt-3">
        <li className="list-group-item">Bottles Donated: 134</li>
        <li className="list-group-item">Points Earned: 210</li>
        <li className="list-group-item">Streak: 5 weeks</li>
      </ul>
    </div>
  );
};

export default UserStats;
