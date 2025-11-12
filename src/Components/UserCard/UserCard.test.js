// import React from 'react';
// import { render } from '@testing-library/react';
// import UserCard from './UserCard';
// import { mockUserObjects, mockUsers } from '../../__mocks__/testData';

// describe('UserCard Snapshot Tests', () => {

//   test('renders complete user card with all props', () => {
//     const { container } = render(
//       <UserCard 
//         user={mockUserObjects.complete}
//         showEmail={true}
//         showBio={true}
//         theme="light"
//       />
//     );
//     expect(container.firstChild).toMatchSnapshot();
//   });

//   test('renders user card in dark theme', () => {
//     const { container } = render(
//       <UserCard 
//         user={mockUsers.complete}
//         theme="dark"
//       />
//     );
//     expect(container.firstChild).toMatchSnapshot();
//   });

//   test('renders user card without email', () => {
//     const { container } = render(
//       <UserCard 
//         user={mockUsers.complete}
//         showEmail={false}
//       />
//     );
//     expect(container.firstChild).toMatchSnapshot();
//   });

//   test('renders user card without bio', () => {
//     const { container } = render(
//       <UserCard 
//         user={mockUsers.complete}
//         showBio={false}
//       />
//     );
//     expect(container.firstChild).toMatchSnapshot();
//   });

//   test('renders minimal user card', () => {
//     const { container } = render(
//       <UserCard user={mockUsers.minimal} />
//     );
//     expect(container.firstChild).toMatchSnapshot();
//   });

//   test('renders user card without avatar', () => {
//     const { container } = render(
//       <UserCard user={mockUsers.withoutAvatar} />
//     );
//     expect(container.firstChild).toMatchSnapshot();
//   });

//   test('renders empty state when no user provided', () => {
//     const { container } = render(
//       <UserCard user={null} />
//     );
//     expect(container.firstChild).toMatchSnapshot();
//   });

//   test('renders inactive user', () => {
//     const inactiveUser = { ...mockUsers.complete, isActive: false };
//     const { container } = render(
//       <UserCard user={inactiveUser} />
//     );
//     expect(container.firstChild).toMatchSnapshot();
//   });

//   test('renders with onClick handler', () => {
//     const mockHandler = jest.fn();
//     const { container } = render(
//       <UserCard 
//         user={mockUsers.complete}
//         onContactClick={mockHandler}
//       />
//     );
//     expect(container.firstChild).toMatchSnapshot();
//   });
// });


import React from 'react';
import { render } from '@testing-library/react';
import UserCard from './UserCard';
import { mockUserObjects } from '../../__mocks__/testData';

describe('UserCard Snapshot Tests', () => {

  test('renders complete user card with all props', () => {
    const { container } = render(
      <UserCard 
        user={mockUserObjects.complete}
        showEmail={true}
        showBio={true}
        theme="light"
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test('renders user card in dark theme', () => {
    const { container } = render(
      <UserCard 
        user={mockUserObjects.complete}
        theme="dark"
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test('renders user card without email', () => {
    const { container } = render(
      <UserCard 
        user={mockUserObjects.complete}
        showEmail={false}
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test('renders user card without bio', () => {
    const { container } = render(
      <UserCard 
        user={mockUserObjects.complete}
        showBio={false}
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test('renders minimal user card', () => {
    const { container } = render(
      <UserCard user={mockUserObjects.minimal} />
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test('renders user card without avatar', () => {
    const { container } = render(
      <UserCard user={mockUserObjects.withoutAvatar} />
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test('renders empty state when no user provided', () => {
    const { container } = render(
      <UserCard user={null} />
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test('renders inactive user', () => {
    const inactiveUser = { ...mockUserObjects.complete, isActive: false };
    const { container } = render(
      <UserCard user={inactiveUser} />
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test('renders with onClick handler', () => {
    const mockHandler = jest.fn();
    const { container } = render(
      <UserCard 
        user={mockUserObjects.complete}
        onContactClick={mockHandler}
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});