import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import BasicList from './basiclist';

describe('BasicList component', () => {
  const items = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
    { id: 3, name: 'Item 3' }
  ];

  const Headlines = ['ID', 'Name'];

  const renderRow = (item) => (
    <>
      <td>{item.id}</td>
      <td>{item.name}</td>
    </>
  );

  const onDelete = jest.fn();
  const onEdit = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with items', () => {
    const { getByText } = render(
      <BasicList
        items={items}
        Headlines={Headlines}
        renderRow={renderRow}
        onDelete={onDelete}
        onEdit={onEdit}
      />
    );

    expect(getByText('Item 1')).toBeInTheDocument();
    expect(getByText('Item 2')).toBeInTheDocument();
    expect(getByText('Item 3')).toBeInTheDocument();
  });

  it('renders no elements message when items are empty', () => {
    const { getByText } = render(
      <BasicList
        items={[]}
        Headlines={Headlines}
        renderRow={renderRow}
        onDelete={onDelete}
        onEdit={onEdit}
      />
    );

    expect(getByText('No hay elementos para mostrar')).toBeInTheDocument();
  });

  it('calls onDelete when delete button is clicked and confirmed', async () => {
    const { getByText, getAllByTestId } = render(
      <BasicList
        items={items}
        Headlines={Headlines}
        renderRow={renderRow}
        onDelete={onDelete}
        onEdit={onEdit}
      />
    );

    const deleteButton = getAllByTestId('delete-button')[0];
    fireEvent.click(deleteButton);

    await waitFor(() => {
      const confirmButton = getByText('si');
      fireEvent.click(confirmButton);
    });

    expect(onDelete).toHaveBeenCalledWith(1);
  });

  it('calls onUpdate when update button is clicked', async () => {
    const { getAllByTestId } = render(
      <BasicList
        items={items}
        Headlines={Headlines}
        renderRow={renderRow}
        onDelete={onDelete}
        onEdit={onEdit}
      />
    );

    const editButton = getAllByTestId('update-button')[0];
    fireEvent.click(editButton);

    expect(onEdit).toHaveBeenCalledWith(1);
  });
});
