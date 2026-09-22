type DashboardHeaderProps = {
  userName: string;
};

export function DashboardHeader({ userName }: DashboardHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Welcome back, {userName}
      </h1>
      <p className="text-gray-600">
        Track your scores, check your winnings, and manage your subscription
      </p>
    </div>
  );
}
