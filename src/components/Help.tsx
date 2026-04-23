import React from 'react';

export default function Help() {
  return (
    <div className="space-y-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-white tracking-tight">Help & Info</h1>
      </header>

      <div className="bg-[#161618] rounded-3xl border border-[#242426] p-6 space-y-8">
        
        <section>
          <h3 className="text-lg font-bold text-teal-400 mb-3">Units & Settings</h3>
          <p className="text-gray-400 mb-2 leading-relaxed">
            By default, My Weight Manager uses kilograms (kg) to track your progress. You can easily switch between Metric (kg) and Imperial (lb) units in the <strong>Settings</strong> tab.
          </p>
          <p className="text-gray-400 leading-relaxed">
            When you switch your units, all your historical data and your Goal Weight will be automatically converted to the new unit format to help keep your progress perfectly matched.
          </p>
        </section>

        <section>
          <h3 className="text-lg font-bold text-teal-400 mb-3">Goal Weight Target</h3>
          <p className="text-gray-400 mb-2 leading-relaxed">
            You can set a <strong>Target Weight</strong> in the Settings tab. This setting serves as your milestone and acts as a baseline point visible in your dashboard header and charts.
          </p>
          <p className="text-gray-400 leading-relaxed">
            Setting a goal will allow tracking to visualize a distinct dashed line inside your Goal Progress chart in the Statistics tab, so you can see exactly where you are compared to where you want to be over time.
          </p>
        </section>

        <section>
          <h3 className="text-lg font-bold text-teal-400 mb-3">BMI Tracking & Calculation</h3>
          <p className="text-gray-400 mb-2 leading-relaxed">
            Your Body Mass Index (BMI) is automatically calculated and displayed on your Dashboard. To enable this feature, simply add your height in the <strong>Settings</strong> tab under "Personal Details & Goals".
          </p>
          <p className="text-gray-400 leading-relaxed">
            The Dashboard uses your most recent weight log and your saved height to provide your real-time BMI score (kg/m²), along with its respective category (Underweight, Normal weight, Overweight, Obese).
          </p>
        </section>

        <section>
          <h3 className="text-lg font-bold text-teal-400 mb-3">Logging Weights</h3>
          <p className="text-gray-400 mb-2 leading-relaxed">
            Use the floating teal Button <strong>"+"</strong> on the bottom right of the Dashboard to log your daily weights. Note that the weight you log corresponds to the chosen Date in the popup modal.
          </p>
          <p className="text-gray-400 leading-relaxed">
            Made a mistake or missed a day? In the <strong>History</strong> tab, you can add past entries or overwrite specific days by logging an entry for that particular date again. We allow for retrospective adding so your graph remains complete.
          </p>
        </section>

        <section>
          <h3 className="text-lg font-bold text-teal-400 mb-3">Date Ranges</h3>
          <p className="text-gray-400 leading-relaxed">
            In the <strong>Statistics</strong> tab, you can select custom date ranges to filter your insights. Use the date toggles on the top right to filter the entire view. The Bar charts array your weekly and monthly averages perfectly across whatever date boundary you define.
          </p>
        </section>

      </div>
    </div>
  );
}
