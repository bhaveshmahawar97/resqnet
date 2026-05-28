import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import DashboardWidget from './DashboardWidget';

// Mock ThemeContext
vi.mock('../../context/ThemeContext', () => ({
  useT: () => ({ T: { border: '#ccc', bgCard: '#fff', textMuted: '#666', danger: 'red', text: '#333' } }),
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
}));

describe('DashboardWidget Component', () => {
  it('renders an EmptyState widget correctly', () => {
    const widget = {
      type: 'EmptyState',
      title: 'No Data',
      emptyMessage: 'Nothing to see here',
    };
    
    render(<DashboardWidget widget={widget} onAction={vi.fn()} />);
    
    expect(screen.getByText('Nothing to see here')).toBeInTheDocument();
  });

  it('renders QuickActions correctly', () => {
    const mockAction = vi.fn();
    const widget = {
      type: 'QuickActions',
      title: 'Actions',
      data: [
        { label: 'Action 1', actionType: 'test' }
      ]
    };
    
    render(<DashboardWidget widget={widget} onAction={mockAction} />);
    
    const actionBtn = screen.getByText('Action 1');
    expect(actionBtn).toBeInTheDocument();
    actionBtn.click();
    expect(mockAction).toHaveBeenCalledWith('test', expect.anything());
  });

  it('renders a fallback for unknown widget types', () => {
    const widget = {
      type: 'UnknownWidgetType123',
    };
    
    render(<DashboardWidget widget={widget} onAction={vi.fn()} />);
    
    expect(screen.getByText('Unknown widget type: UnknownWidgetType123')).toBeInTheDocument();
  });
});
