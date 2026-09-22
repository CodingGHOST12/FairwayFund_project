import { Charity } from '@/types';
import { CharityHero } from './CharityHero';
import { CharityEvents } from './CharityEvents';
import { charityConfig } from '@/lib/charity/charity-config';

type CharityDetailProps = {
  charity: Charity;
  onSelectCTA?: () => void;
};

export function CharityDetail({ charity, onSelectCTA }: CharityDetailProps) {
  return (
    <div className="space-y-10">
      <CharityHero charity={charity} onSelectCTA={onSelectCTA} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">About {charity.name}</h2>
            <div className="text-gray-700 leading-relaxed text-base space-y-4">
              <p>{charity.longDescription}</p>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 space-y-4">
            <h3 className="text-xl font-bold text-gray-900">Upcoming Events & Community Days</h3>
            <CharityEvents events={charity.events} />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 space-y-4">
            <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">
              %
            </div>
            <h3 className="text-lg font-bold text-gray-900">Subscription Impact</h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              When selected, at least <strong>{charityConfig.minimumContributionPercentage}%</strong> of your monthly or annual subscription fee is dedicated to supporting {charity.name}.
            </p>
            <p className="text-xs text-green-900 font-medium">
              You can increase your contribution percentage anytime up to {charityConfig.maximumContributionPercentage}%.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-3">
            <h4 className="font-bold text-gray-900 text-sm">Charity Overview</h4>
            <div className="divide-y divide-gray-100 text-xs">
              <div className="py-2.5 flex justify-between">
                <span className="text-gray-500">Cause Category</span>
                <span className="font-semibold text-gray-900">{charity.category}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-gray-500">Region</span>
                <span className="font-semibold text-gray-900">{charity.location}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-gray-500">Registration</span>
                <span className="font-semibold text-gray-900">{charity.registrationNumber}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
