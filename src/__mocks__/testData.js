// export const mockUsers = {
//   complete: {
//     name: 'Victor Uma sam',
//     email: 'Victor.doe@example.com',
//     bio: 'Senior Software Engineer with 10 years of experience in web development and Technical writing. Passionate about React and testing.',
//     avatarUrl: 'https://via.placeholder.com/150',
//     role: 'Senior Developer',
//     isActive: true
//   },
//   minimal: {
//     name: 'John Smith',
//     isActive: false
//   },
//   withoutAvatar: {
//     name: 'Alice Johnson',
//     email: 'alice@example.com',
//     role: 'Product Manager',
//     isActive: true
//   }
// };

// ---------------------------------------------------------------
// export const mockUsers = [
//   {
//     name: 'Victor Uma',
//     email: 'Victor.uma@example.com',
//     bio: 'Senior Software Engineer with 10 years of experience in web development and Technical writing.',
//     // Remove avatarUrl so it shows the initial instead
//     role: 'Senior Developer',
//     isActive: true
//   },
//   {
//     name: 'John Smith',
//     email: 'john.smith@example.com',
//     role: 'Junior Developer',
//     isActive: false
//   },
//   {
//     name: 'Alice Johnson',
//     email: 'alice@example.com',
//     bio: 'Product Manager passionate about user experience and agile methodologies.',
//     role: 'Product Manager',
//     isActive: true
//   }
// ];

// ---------------------------------------------------------------
// Individual user objects for testing
const completeUser = {
  id: 1,
  name: "Victor Uma",
  email: "Victor.uma@example.com",
  avatar: "https://i.pravatar.cc/150?img=1",
  bio: "Senior Software Engineer with 10 years of experience in web development and technical writing.",
  role: "Senior Developer",
  isActive: true,
};

const minimalUser = {
  id: 2,
  name: "John Smith",
  email: "john.smith@example.com",
  role: "Junior Developer",
  isActive: false,
};

const withoutAvatarUser = {
  id: 3,
  name: "Alice Johnson",
  email: "alice@example.com",
  avatar: null,
  bio: "Product Manager passionate about user experience and agile methodologies.",
  role: "Product Manager",
  isActive: true,
};

// Export both formats
export const mockUsers = [completeUser, minimalUser, withoutAvatarUser]; // Array for components that need to iterate

export const mockUserObjects = {
  complete: completeUser,
  minimal: minimalUser,
  withoutAvatar: withoutAvatarUser,
}; // Objects for testing
