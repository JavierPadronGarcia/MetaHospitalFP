import React, { useContext } from 'react';
import { RolesContext, RolesProvider } from './roles';
import { render, getByText, fireEvent, waitFor } from '@testing-library/react';

describe('RoleContext', () => {

  it('RolesProvider renders children with updated role', async () => {
    const MyComponent = () => {
      const { role, setRole } = useContext(RolesContext);

      return (
        <div>
          <h2>Role: {role}</h2>
          <button onClick={() => setRole('editor')}>Set to Editor</button>
        </div>
      );
    };

    const { getByText } = render(
      <RolesProvider>
        <MyComponent />
      </RolesProvider>
    );

    expect(getByText(/Role:/i)).toBeInTheDocument();

    fireEvent.click(getByText(/Set to Editor/i));

    await waitFor(() => {
      expect(getByText(/Role: editor/i)).toBeInTheDocument();
    });
  });
});