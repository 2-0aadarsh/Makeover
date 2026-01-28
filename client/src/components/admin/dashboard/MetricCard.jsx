/* eslint-disable react/prop-types */
import React from 'react';
import { FaArrowTrendUp } from "react-icons/fa6";
import { FaArrowTrendDown } from "react-icons/fa6";

/**
 * MetricCard - KPI card component for admin dashboard
 * Displays metric value, icon, and trend indicator
 * 
 * @param {string} title - Card title (e.g., "Total User")
 * @param {string|number} value - Main metric value
 * @param {string|ReactNode} icon - Icon component or emoji
 * @param {number} growth - Growth percentage (can be negative)
 * @param {string} trend - "up" or "down"
 * @param {string} label - Trend label (e.g., "Down from yesterday")
 * @param {string} iconColor - Tailwind color class for icon background
 * @param {string} iconBgColor - Custom background color for icon (hex)
 * @param {number} iconBgOpacity - Custom background opacity (0-1)
 * @param {string} iconTextColor - Custom icon color (hex)
 */
const MetricCard = ({ 
  title, 
  value, 
  icon, 
  growth, 
  trend, 
  label, 
  iconColor = "bg-purple-100",
  iconBgColor,
  iconBgOpacity,
  iconTextColor
}) => {
  const isPositive = trend === "up";
  const trendColor = isPositive ? '#00B69B' : '#F93C65';
  const growthIcon = isPositive ? (
    <FaArrowTrendUp style={{ width: '16px', height: '16px', color: trendColor }} />
  ) : (
    <FaArrowTrendDown style={{ width: '16px', height: '16px', color: trendColor }} />
  );

  // Determine if icon is a React component (JSX element) or emoji (string)
  const isReactIcon = React.isValidElement(icon);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
          <p className="text-3xl font-bold text-gray-800 mb-3">{value}</p>
          <div className="flex items-center gap-1">
            <span className="text-sm font-medium flex items-center gap-1" style={{ color: trendColor }}>
              {growthIcon} {Math.abs(growth)}%
            </span>
            <span className="text-sm text-gray-500">{label}</span>
          </div>
        </div>
        <div 
          className={`${!iconBgColor ? iconColor : ''} flex items-center justify-center relative`}
          style={{
            width: iconBgColor ? '60px' : undefined,
            height: iconBgColor ? '60px' : undefined,
            padding: !iconBgColor ? '12px' : undefined,
            borderRadius: iconBgColor ? '12px' : undefined,
          }}
        >
          {/* Background layer with opacity */}
          {iconBgColor && (
            <div
              className="absolute inset-0"
              style={{
                backgroundColor: iconBgColor,
                opacity: iconBgOpacity !== undefined ? iconBgOpacity : 0.21,
                borderRadius: '24px',
              }}
            />
          )}
          {/* Icon layer (not affected by opacity) */}
          <div className="relative z-10" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {isReactIcon ? (
              React.cloneElement(icon, {
                style: {
                  ...(icon.props?.style || {}),
                  color: iconTextColor || icon.props?.style?.color || '#8280FF',
                  width: icon.props?.style?.width || '24px',
                  height: icon.props?.style?.height || '24px',
                }
              })
            ) : (
              <span className="text-2xl">{icon}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricCard;
