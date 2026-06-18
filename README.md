# 1.Landing Page

## Overview

The Landing Page serves as the entry point of the ProjectFlow Management System. It introduces users to the platform and provides quick access to Login and Signup functionalities. The page highlights the core features of the system and offers a modern, user-friendly interface.

## Key Features

### Navigation
- Access Login Page.
- Access Signup Page.
- Responsive navigation bar.
- ProjectFlow branding.

### Hero Section
- Displays the Project Assignment System title.
- Highlights the purpose of the application.
- Includes an animated illustration for improved visual appeal.

### Feature Highlights
- Project Assignment Management.
- Deadline Tracking.
- Secure Role-Based Access.
- Employee Management.

### Theme Management
- Supports Light Mode and Dark Mode.
- Theme preference is stored using Local Storage.
- Automatically restores the selected theme on page reload.

### Interactive Design
- Animated floating illustration.
- Hover effects on feature cards.
- Smooth transitions between themes.

### Responsive Design
- Optimized for Mobile Devices.
- Optimized for Tablets.
- Optimized for Desktop Screens.
- Built using Bootstrap 5 responsive components.

## Technologies Used

- HTML5
- CSS3
- Bootstrap 5
- JavaScript (ES6)
- Bootstrap Icons
- Local Storage

## Workflow

1. User visits the Landing Page.
2. User explores application features.
3. User selects Signup to create a new account.
4. User selects Login to access the system.
5. Theme preference is saved and maintained across pages.

## Benefits

- Simple and attractive user interface.
- Easy navigation to application modules.
- Consistent light and dark theme experience.
- Responsive design across all devices.
- Clear presentation of system features.



# 2.Login Page

## Overview

The Login Page serves as the authentication gateway of the ProjectFlow Management System. It allows registered users to securely access the application using their Email and Password. Based on their role, users are redirected to the appropriate dashboard after successful authentication.

## Key Features

### User Authentication
- Login using registered Email and Password.
- Validates user credentials against stored employee records.
- Prevents unauthorized access.
- Displays appropriate error messages for invalid login attempts.

### Form Validation
- Validates Email field before submission.
- Validates Password field before submission.
- Prevents empty field submissions.
- Provides visual feedback using Bootstrap validation styles.

### Role-Based Redirection
- Redirects Admin users to the Admin Dashboard.
- Redirects Employee users to the Employee Dashboard.
- Ensures proper access based on user role.

### Login Confirmation
- Displays a confirmation popup before completing login.
- Uses SweetAlert2 for enhanced user interaction.

### Session Management
- Stores logged-in user information using Local Storage.
- Maintains user session throughout application usage.
- Supports secure logout functionality from dashboards.

### Theme Management
- Supports Light Mode and Dark Mode.
- Saves theme preference using Local Storage.
- Automatically restores the selected theme on page reload.

### User Notifications
- Displays success notifications after login.
- Shows error notifications for invalid credentials.
- Provides server error notifications when API requests fail.

### Navigation Support
- Provides a direct link to the Signup Page.
- Allows new users to register easily.
- Displays ProjectFlow branding through the navigation bar.

### Responsive Design
- Optimized for Mobile Devices.
- Optimized for Tablets.
- Optimized for Desktop Screens.
- Built using Bootstrap 5 responsive components.

## Technologies Used

- HTML5
- CSS3
- Bootstrap 5
- JavaScript (ES6)
- jQuery
- Bootstrap Icons
- SweetAlert2
- JSON Server
- Local Storage

## Workflow

1. User enters Email and Password.
2. Form validation checks all required fields.
3. Employee data is fetched from JSON Server.
4. Credentials are verified against stored records.
5. Login confirmation popup is displayed.
6. User information is stored in Local Storage.
7. User is redirected based on their role.
8. Theme preference is maintained across sessions.

## Benefits

- Secure user authentication.
- Role-based dashboard access.
- Simple and user-friendly interface.
- Persistent theme preferences.
- Responsive across all devices.
- Enhanced user experience with alerts and notifications.



# 3.Signup Page

## Overview

The Signup Page allows new employees to register in the ProjectFlow Management System. It collects employee information, validates user input, and stores employee records in the system for future authentication and project assignment.

## Key Features

### Employee Registration
- Register new employees into the system.
- Capture employee details including personal and professional information.
- Store employee data using JSON Server.

### Employee Information Management
- Employee ID
- Full Name
- Email Address
- Phone Number
- Date of Joining
- Department
- Designation
- Password

### Form Validation
- Employee ID validation.
- Full Name validation using alphabet and space checks.
- Email format validation.
- Mobile number validation.
- Department selection validation.
- Designation selection validation.
- Password strength validation.
- Confirm Password matching validation.

### Password Security
Password must contain:
- Minimum 6 characters.
- At least one uppercase letter.
- At least one lowercase letter.
- At least one number.
- At least one special character.

### Data Persistence
- Automatically saves form data using Local Storage.
- Restores previously entered information when the page reloads.
- Prevents accidental data loss during registration.

### User Notifications
- Registration success notifications.
- Validation error messages.
- Server error notifications.
- Interactive alerts using SweetAlert2.

### Theme Management
- Supports Light Mode and Dark Mode.
- Stores theme preference using Local Storage.
- Automatically restores selected theme on page reload.

### Navigation Support
- Provides direct access to the Login Page.
- Allows users to switch between registration and login easily.

### Responsive Design
- Optimized for Mobile Devices.
- Optimized for Tablets.
- Optimized for Desktop Screens.
- Built using Bootstrap 5 responsive components.

## Technologies Used

- HTML5
- CSS3
- Bootstrap 5
- JavaScript (ES6)
- jQuery
- Bootstrap Icons
- SweetAlert2
- JSON Server
- Local Storage

## Workflow

1. User opens the Signup Page.
2. User enters employee details.
3. Form validation checks all inputs.
4. Employee data is stored in JSON Server.
5. Success notification is displayed.
6. Form data is cleared from Local Storage.
7. User is redirected to the Landing Page.
8. User can proceed to Login using registered credentials.

## Benefits

- Easy employee registration process.
- Strong client-side validation.
- Prevents accidental data loss.
- Secure password requirements.
- Responsive user interface.
- Consistent light and dark theme experience.






# 4.Admin Dashboard

## Overview

The Admin Dashboard serves as the central management hub of the ProjectFlow Management System. It enables administrators to assign projects, manage employees, monitor project progress, track overdue tasks, and maintain project records efficiently through a user-friendly interface.

## Key Features

### Project Assignment
- Assign projects to employees based on department.
- Automatically generate unique Project IDs.
- Define project deadlines and remarks.
- Validate project information before submission.

### Project Management
- View all assigned projects.
- Edit project details when required.
- Soft delete projects instead of permanent removal.
- Restore deleted projects whenever needed.

### Employee Management
- View all registered employees in a structured directory.
- Display employee information including Employee ID, Name, Email, Department, Designation, and Joining Date.

### Project Status Monitoring
- Track projects based on status:
  - Not Yet Started
  - In Progress
  - Completed
  - Overdue
  - Deleted

### Search and Filtering
- Search projects by project name.
- Search projects by employee ID.
- Filter projects based on status.
- Filter projects using date ranges.

### Pagination
- Display projects page by page for improved performance and better user experience.

### Dark Mode Support
- Toggle between Light Mode and Dark Mode.
- Store user theme preferences using Local Storage.

### Account Management
- View administrator profile information.
- Access account details through an off-canvas panel.
- Secure logout functionality.

### Responsive Design
- Optimized for Mobile Devices.
- Optimized for Tablets.
- Optimized for Desktop Screens.
- Built using Bootstrap 5 responsive components.

## Technologies Used

- HTML5
- CSS3
- Bootstrap 5
- JavaScript (ES6)
- Bootstrap Icons
- SweetAlert2
- JSON Server

## Workflow

1. Administrator logs into the system.
2. Assigns projects to employees.
3. Employees work on assigned projects.
4. Dashboard tracks project progress and deadlines.
5. Completed, overdue, and deleted projects are managed through dedicated sections.
6. Administrators can edit, restore, or monitor projects at any time.

## Benefits

- Centralized project management.
- Improved employee tracking.
- Efficient project monitoring.
- Better deadline management.
- Enhanced user experience through responsive design and dark mode support.


# 5.Employee Dashboard

## Overview

The Employee Dashboard provides employees with a centralized workspace to view assigned projects, update project progress, monitor deadlines, and manage their account information. It enables employees to track their work efficiently through a simple and interactive interface.

## Key Features

### Project Management
- View all assigned projects.
- View project details including description and deadlines.
- Monitor project progress through status indicators.
- Identify newly assigned projects.

### Project Status Updates
Employees can update project status:

- Not Yet Started → In Progress
- In Progress → Completed

### Project Monitoring
Track projects based on status:

- All Projects
- In Progress
- Completed
- Not Yet Started
- Overdue

### Search and Filtering
- Search projects by project name.
- Filter projects using date ranges.
- Reset filters with a single click.

### Sorting
- Sort projects by Assigned Date.
- Sort projects by End Date.
- Sort projects by Project Name.
- Display newest projects first.

### Pagination
- Display projects page by page.
- Improve dashboard performance.
- Simplify navigation through large project lists.

### Project Notifications
- Highlights newly assigned projects.
- Displays visual indicators for new tasks.
- Shows overdue projects automatically.

### Account Management
- View employee profile information.
- Access account details through an off-canvas panel.
- Secure logout functionality.

### Dark Mode Support
- Toggle between Light Mode and Dark Mode.
- Store user theme preferences using Local Storage.

### Project Progress Tracking
- Progress bars for project completion.
- Visual status badges.
- Deadline monitoring and overdue detection.

### Responsive Design
- Optimized for Mobile Devices.
- Optimized for Tablets.
- Optimized for Desktop Screens.
- Built using Bootstrap 5 responsive components.

## Technologies Used

- HTML5
- CSS3
- Bootstrap 5
- JavaScript (ES6)
- jQuery
- Bootstrap Icons
- SweetAlert2
- JSON Server
- Local Storage

## Workflow

1. Employee logs into the system.
2. Assigned projects are displayed on the dashboard.
3. Projects can be searched, filtered, sorted, and paginated.
4. Employee views project details and deadlines.
5. Employee updates project status when work begins.
6. Employee marks projects as completed after finishing tasks.
7. Dashboard automatically updates project statistics and status counts.

## Benefits

- Easy project tracking.
- Improved task visibility.
- Better deadline management.
- Faster project navigation through pagination.
- Organized project viewing using sorting options.
- Quick status updates.
- Responsive user interface.
- Enhanced user experience through dark mode support.
- Centralized employee workspace.