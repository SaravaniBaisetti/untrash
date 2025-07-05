const RecentActivity = () => {
  return (
    <div className="card p-4 shadow">
      <h5 className="text-info">🕒 Recent Activity</h5>
      <ul className="list-group list-group-flush mt-3">
        <li className="list-group-item">10 kg picked up on July 1</li>
        <li className="list-group-item">5 kg donated on June 28</li>
        <li className="list-group-item">Reward redeemed on June 25</li>
      </ul>
    </div>
  );
};

export default RecentActivity;
