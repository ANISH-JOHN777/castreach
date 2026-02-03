import { useState } from 'react';
import { mockAnalytics } from '../mock-data/data';
import { TrendingUp, TrendingDown, Eye, Calendar, DollarSign, Users, BarChart3, PieChart } from 'lucide-react';
import './Analytics.css';

const Analytics = () => {
    const [timeRange, setTimeRange] = useState('month');
    const { profileViews, bookings, revenue, topTopics, audienceDemographics } = mockAnalytics;

    const StatCard = ({ icon: Icon, title, value, trend, trendUp, color }) => (
        <div className={`stat-card ${color}`}>
            <div className="stat-icon">
                <Icon size={24} />
            </div>
            <div className="stat-details">
                <div className="stat-title">{title}</div>
                <div className="stat-value">{value}</div>
                {trend && (
                    <div className={`stat-trend ${trendUp ? 'up' : 'down'}`}>
                        {trendUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                        <span>{trend}</span>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="analytics-page">
            <div className="container">
                <div className="analytics-header">
                    <div>
                        <h1 className="analytics-title">Analytics Dashboard</h1>
                        <p className="analytics-subtitle">Track your performance and growth</p>
                    </div>
                    <div className="time-range-selector">
                        <button
                            className={timeRange === 'week' ? 'active' : ''}
                            onClick={() => setTimeRange('week')}
                        >
                            Week
                        </button>
                        <button
                            className={timeRange === 'month' ? 'active' : ''}
                            onClick={() => setTimeRange('month')}
                        >
                            Month
                        </button>
                        <button
                            className={timeRange === 'year' ? 'active' : ''}
                            onClick={() => setTimeRange('year')}
                        >
                            Year
                        </button>
                    </div>
                </div>

                {/* Key Metrics */}
                <div className="stats-grid">
                    <StatCard
                        icon={Eye}
                        title="Profile Views"
                        value={profileViews.thisMonth.toLocaleString()}
                        trend={profileViews.trend}
                        trendUp={true}
                        color="primary"
                    />
                    <StatCard
                        icon={Calendar}
                        title="Total Bookings"
                        value={bookings.total}
                        trend={`${bookings.conversionRate} conversion`}
                        trendUp={true}
                        color="success"
                    />
                    <StatCard
                        icon={DollarSign}
                        title="Revenue"
                        value={`$${revenue.thisMonth.toLocaleString()}`}
                        trend={revenue.trend}
                        trendUp={true}
                        color="warning"
                    />
                    <StatCard
                        icon={Users}
                        title="Completed Episodes"
                        value={bookings.completed}
                        trend={`${bookings.pending} pending`}
                        trendUp={false}
                        color="info"
                    />
                </div>

                {/* Charts Section */}
                <div className="charts-grid">
                    {/* Profile Views Chart */}
                    <div className="chart-card">
                        <div className="chart-header">
                            <h3>Profile Views Trend</h3>
                            <BarChart3 size={20} />
                        </div>
                        <div className="chart-content">
                            <div className="bar-chart">
                                {profileViews.data.map((item, index) => {
                                    const maxViews = Math.max(...profileViews.data.map(d => d.views));
                                    const height = (item.views / maxViews) * 100;
                                    return (
                                        <div key={index} className="bar-item">
                                            <div className="bar-wrapper">
                                                <div
                                                    className="bar"
                                                    style={{ height: `${height}%` }}
                                                    title={`${item.views} views`}
                                                />
                                            </div>
                                            <div className="bar-label">
                                                {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Revenue Chart */}
                    <div className="chart-card">
                        <div className="chart-header">
                            <h3>Revenue Over Time</h3>
                            <TrendingUp size={20} />
                        </div>
                        <div className="chart-content">
                            <div className="line-chart">
                                {revenue.data.map((item, index) => {
                                    const maxRevenue = Math.max(...revenue.data.map(d => d.revenue));
                                    const height = (item.revenue / maxRevenue) * 100;
                                    return (
                                        <div key={index} className="line-item">
                                            <div className="line-wrapper">
                                                <div
                                                    className="line-point"
                                                    style={{ bottom: `${height}%` }}
                                                    title={`$${item.revenue}`}
                                                />
                                            </div>
                                            <div className="line-label">{item.month}</div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Top Topics & Demographics */}
                <div className="insights-grid">
                    {/* Top Topics */}
                    <div className="insight-card">
                        <div className="insight-header">
                            <h3>Top Topics</h3>
                            <PieChart size={20} />
                        </div>
                        <div className="topics-list">
                            {topTopics.map((topic, index) => (
                                <div key={index} className="topic-item">
                                    <div className="topic-info">
                                        <span className="topic-name">{topic.topic}</span>
                                        <span className="topic-count">{topic.count} episodes</span>
                                    </div>
                                    <div className="topic-bar-container">
                                        <div
                                            className="topic-bar"
                                            style={{ width: `${topic.percentage}%` }}
                                        />
                                    </div>
                                    <span className="topic-percentage">{topic.percentage}%</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Audience Demographics */}
                    <div className="insight-card">
                        <div className="insight-header">
                            <h3>Audience Demographics</h3>
                            <Users size={20} />
                        </div>
                        <div className="demographics-content">
                            <div className="demo-section">
                                <h4>Age Groups</h4>
                                {audienceDemographics.ageGroups.map((group, index) => (
                                    <div key={index} className="demo-item">
                                        <span className="demo-label">{group.range}</span>
                                        <div className="demo-bar-container">
                                            <div
                                                className="demo-bar"
                                                style={{ width: `${group.percentage}%` }}
                                            />
                                        </div>
                                        <span className="demo-value">{group.percentage}%</span>
                                    </div>
                                ))}
                            </div>
                            <div className="demo-section">
                                <h4>Top Locations</h4>
                                {audienceDemographics.locations.map((location, index) => (
                                    <div key={index} className="demo-item">
                                        <span className="demo-label">{location.country}</span>
                                        <div className="demo-bar-container">
                                            <div
                                                className="demo-bar"
                                                style={{ width: `${location.percentage}%` }}
                                            />
                                        </div>
                                        <span className="demo-value">{location.percentage}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Booking Status Breakdown */}
                <div className="booking-breakdown">
                    <h3>Booking Status Overview</h3>
                    <div className="breakdown-stats">
                        <div className="breakdown-item completed">
                            <div className="breakdown-value">{bookings.completed}</div>
                            <div className="breakdown-label">Completed</div>
                        </div>
                        <div className="breakdown-item pending">
                            <div className="breakdown-value">{bookings.pending}</div>
                            <div className="breakdown-label">Pending</div>
                        </div>
                        <div className="breakdown-item cancelled">
                            <div className="breakdown-value">{bookings.cancelled}</div>
                            <div className="breakdown-label">Cancelled</div>
                        </div>
                        <div className="breakdown-item total">
                            <div className="breakdown-value">{bookings.total}</div>
                            <div className="breakdown-label">Total</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
