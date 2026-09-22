import { Container } from '../layout/Container';

export function ScoreExplanation() {
  const exampleScores = [
    { score: 34, course: 'Sunnydale GC', status: 'active' },
    { score: 36, course: 'Riverside Links', status: 'active' },
    { score: 29, course: 'Pinehurst', status: 'active' },
    { score: 40, course: 'Oak Valley', status: 'active' },
    { score: 37, course: 'Meadowbrook', status: 'active' },
  ];

  return (
    <Container>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="animate-fade-in">
          <span className="text-sm font-bold text-green-600 uppercase tracking-wider">Score Tracking</span>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mt-2 mb-6">
            Your Latest Five Scores
          </h2>
          <p className="text-lg text-gray-600 mb-6 leading-relaxed">
            FairwayFund keeps your most recent five Stableford scores active. These scores
            form your draw entry each month. When you add a new score, the oldest one is
            automatically replaced.
          </p>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
              </div>
              <p className="text-gray-700">Stableford scores between <strong>1 and 45</strong> points</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
              </div>
              <p className="text-gray-700">One score per date</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
              </div>
              <p className="text-gray-700">Newest five scores are always retained</p>
            </div>
          </div>
        </div>

        <div className="animate-fade-in-right">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Example: Your Active Scores</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {exampleScores.map((s, i) => (
                <div key={i} className="flex items-center justify-between px-6 py-4">
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-medium text-gray-400 w-5">#{i + 1}</span>
                    <span className="text-sm text-gray-500">{s.course}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-gray-900">{s.score}</span>
                    <span className="text-xs text-green-600 font-medium">Active</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-6 py-4 bg-amber-50 border-t border-amber-100">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-amber-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <p className="text-sm text-amber-800">
                  <strong>New score added?</strong> Your oldest active score is replaced automatically.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
