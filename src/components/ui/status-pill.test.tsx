import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { StatusPill } from './status-pill';

describe('StatusPill', () => {
  it('renders the active state', () => {
    render(<StatusPill active />);
    expect(screen.getByText('Active')).toBeInTheDocument();
  });
});
