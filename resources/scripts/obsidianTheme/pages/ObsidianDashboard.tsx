import React from 'react';
import { ObsidianProvider } from '../obsidian/context/ObsidianContext';
import { ObsidianLayout } from '../obsidian/components/ObsidianLayout';
import { ObsidianSidebar } from '../obsidian/components/ObsidianSidebar';
import { ObsidianNavbar } from '../obsidian/components/ObsidianNavbar';
import { Customizer } from '../obsidian/customizer/Customizer';

// Server mock data for UI structure
const mockServers = [
    { id: '1', name: 'Survival SMP', node: 'Node-1 (US-East)', cpu: '45%', ram: '4.2 GB / 8 GB', disk: '12 GB / 50 GB', status: 'running' },
    { id: '2', name: 'Lobby', node: 'Node-1 (US-East)', cpu: '12%', ram: '1.1 GB / 4 GB', disk: '2 GB / 10 GB', status: 'running' },
    { id: '3', name: 'Skyblock', node: 'Node-2 (EU-West)', cpu: '0%', ram: '0 GB / 6 GB', disk: '5 GB / 20 GB', status: 'offline' }
];

const DashboardContent: React.FC = () => {
    return (
        <ObsidianLayout
            sidebar={
                <ObsidianSidebar userName="Admin" userRole="Owner">
                    <div className="obsidian-sidebar__section">
                        <div className="obsidian-sidebar__section-label">Main</div>
                        <button className="obsidian-sidebar__item obsidian-sidebar__item--active">
                            <svg className="obsidian-sidebar__item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="3" width="7" height="7"></rect>
                                <rect x="14" y="3" width="7" height="7"></rect>
                                <rect x="14" y="14" width="7" height="7"></rect>
                                <rect x="3" y="14" width="7" height="7"></rect>
                            </svg>
                            <span className="obsidian-sidebar__item-label">Servers</span>
                        </button>
                        <button className="obsidian-sidebar__item">
                            <svg className="obsidian-sidebar__item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                            <span className="obsidian-sidebar__item-label">Account</span>
                        </button>
                    </div>
                </ObsidianSidebar>
            }
            navbar={
                <ObsidianNavbar breadcrumbs={[{ label: 'Dashboard' }]} />
            }
        >
            <div className="obsidian-page-header">
                <div>
                    <h1 className="obsidian-page-title">Your Servers</h1>
                    <p className="obsidian-page-subtitle">Manage your active server instances.</p>
                </div>
            </div>

            <div className="obsidian-grid obsidian-grid--servers">
                {mockServers.map(server => (
                    <a key={server.id} href={`/server/${server.id}`} className="obsidian-server-card">
                        <div className="obsidian-server-card__header">
                            <div>
                                <div className="obsidian-server-card__name">{server.name}</div>
                                <div className="obsidian-server-card__description">{server.id.substring(0, 8)}...</div>
                            </div>
                            <span className={`obsidian-badge obsidian-badge--${server.status === 'running' ? 'success' : 'neutral'}`} style={{ padding: '4px 8px' }}>
                                <span className="obsidian-badge__dot" />
                                {server.status === 'running' ? 'Online' : 'Offline'}
                            </span>
                        </div>
                        
                        <div className="obsidian-server-card__body">
                            <div className="obsidian-server-card__metrics">
                                <div className="obsidian-server-card__metric">
                                    <span className="obsidian-server-card__metric-label">CPU Usage</span>
                                    <span className="obsidian-server-card__metric-value">{server.cpu}</span>
                                </div>
                                <div className="obsidian-server-card__metric">
                                    <span className="obsidian-server-card__metric-label">Memory</span>
                                    <span className="obsidian-server-card__metric-value">{server.ram}</span>
                                </div>
                                <div className="obsidian-server-card__metric">
                                    <span className="obsidian-server-card__metric-label">Disk</span>
                                    <span className="obsidian-server-card__metric-value">{server.disk}</span>
                                </div>
                            </div>
                        </div>

                        <div className="obsidian-server-card__footer">
                            <div className="obsidian-server-card__node">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '4px', verticalAlign: 'middle' }}>
                                    <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
                                    <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
                                    <line x1="6" y1="6" x2="6.01" y2="6"></line>
                                    <line x1="6" y1="18" x2="6.01" y2="18"></line>
                                </svg>
                                {server.node}
                            </div>
                        </div>
                    </a>
                ))}
            </div>

            <Customizer />
        </ObsidianLayout>
    );
};

export const ObsidianDashboard: React.FC = () => {
    return (
        <ObsidianProvider>
            <DashboardContent />
        </ObsidianProvider>
    );
};

export default ObsidianDashboard;
