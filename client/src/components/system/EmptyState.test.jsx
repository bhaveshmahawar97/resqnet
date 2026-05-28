import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import EmptyState from './EmptyState';

// Mock Framer Motion to avoid animation issues in jsdom
vi.mock('framer-motion', () => {
  return {
    motion: {
      div: ({ children, ...props }) => <div {...props}>{children}</div>,
    },
  };
});

describe('EmptyState Component', () => {
  it('renders correctly with default props', () => {
    render(<EmptyState />);
    expect(screen.getByText('No data found')).toBeInTheDocument();
  });

  it('renders with custom props', () => {
    render(
      <EmptyState
        icon="string-icon"
        title="Custom Title"
        message="Custom message text"
      />
    );
    expect(screen.getByText('Custom Title')).toBeInTheDocument();
    expect(screen.getByText('Custom message text')).toBeInTheDocument();
  });

  it('renders action button if action and actionLabel are provided', () => {
    const mockAction = vi.fn();
    render(
      <EmptyState
        onAction={mockAction}
        actionLabel="Click Me"
      />
    );
    
    const button = screen.getByText('Click Me');
    expect(button).toBeInTheDocument();
    
    // Simulate click
    button.click();
    expect(mockAction).toHaveBeenCalledTimes(1);
  });
});
