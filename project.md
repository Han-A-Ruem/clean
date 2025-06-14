# Clean Connect App

## Project Overview
Clean Connect is a platform that connects customers with cleaning service providers (cleaners). The application facilitates booking cleaning services, managing reservations, and communication between customers, cleaners, and administrators.


Cleaner flow 
- cleaner will register - Applying for  interview is mandatory - after registring they need to wiat for the amdin to aprove the interview - they need to 


## Project Structure


## Project Purpose

Clean Connect App serves as a platform to:

1. **Connect Customers with Cleaning Services**: Allow customers to discover, book, and review cleaning services.
2. **Manage Cleaner Operations**: Provide cleaners with tools to manage their schedules, services, and customer relationships.
3. **Administrative Oversight**: Give administrators tools to monitor and manage the platform, including users, cleaners, reservations, and more.
4. **Streamlined Communication**: Facilitate communication between customers, cleaners, and administrators through an in-app chat system.


```
src/
├── components/     # Reusable UI components
│   ├── admin/      # Admin dashboard components
│   ├── chat/       # Chat functionality components
│   ├── ui/         # Basic UI components (buttons, inputs, etc.)
│   └── Utils/      # Utility components like PageHeader
│
├── contexts/       # React context providers
│   ├── UserContext.tsx     # User authentication and profile context
│   ├── PromotionContext.tsx # Promotion management context
│   └── ...
│
├── hooks/          # Custom React hooks
│   ├── useChat.ts  # Chat functionality hook
│   ├── use-toast.ts # Toast notification hook
│   └── ...
│
├── integrations/   # External service integrations
│   ├── supabase/   # Supabase client and types
│
├── model/          # Data models and database operations
│   ├── User.ts     # User-related database operations
│   ├── Chat.ts     # Chat-related database operations
│   └── ...
│
├── pages/          # Page components
│   ├── Admin.tsx   # Admin dashboard page
│   └── ...
│
├── routes/         # Route handlers
│   ├── AdminRouteHandler.tsx         # Admin routes
│   ├── CleanerOnboardingRouteHandler.tsx  # Cleaner onboarding routes
│   └── ...
│
├── App.tsx         # Root application component
└── ...
```



## Database Schema

### Key Tables

1. **users**
   - `user_id`: Primary key
   - `email`: User's email
   - `type`: User type (customer, cleaner, admin)
   - `name`: User's name
   - `referal_code`: Unique referral code
   - `is_active`: Account status
   - `status`: User status (registered, interview_info_entered, interview_applied, interview_completed, documents_submitted, active)
   - `monthly_cancellation_limit`: Limit for cancellations per month
   - `monthly_cancellations`: Current number of cancellations
   - `preferred_work_regions`: Array of preferred regions for cleaners
   - `preferred_working_days`: Array of preferred working days
   - `preferred_working_hours`: Array of preferred working hours
   - `tags`: Array of tags for categorization
   - `profile_photo`: URL to profile image

2. **ranks**
   - `id`: Primary key
   - `name`: Rank name
   - `description`: Rank description
   - `benefits`: Rank benefits

3. **addresses**
   - `id`: Primary key
   - `user_id`: Foreign key to users
   - `address`: Address details
   - `is_default`: Whether this is the default address

4. **reservations**
   - `id`: Primary key
   - `customer_id`: Foreign key to users (customer)
   - `cleaner_id`: Foreign key to users (cleaner)
   - `address`: Address for service
   - `date`: Array of service dates
   - `status`: Reservation status
   - `amount`: Service cost

5. **chats**
   - `id`: Primary key
   - `customer_id`: Foreign key to users (customer)
   - `cleaner_id`: Foreign key to users (cleaner)
   - `reservation_id`: Foreign key to reservations
   - `is_admin_chat`: Whether this is an admin support chat
   - `created_at`: Creation timestamp
   - `updated_at`: Update timestamp

6. **chat_messages**
   - `id`: Primary key
   - `chat_id`: Foreign key to chats
   - `sender_id`: Foreign key to users
   - `message`: Message content
   - `is_read`: Read status
   - `created_at`: Creation timestamp

7. **events**
   - Details of promotional events

8. **promotions**
   - Details of promotions and discounts

9. **shop**
   - Product listings for the shop feature

## Features

### User Management
- **Registration and Authentication**: Email-based registration and login, Socail login
- **User Types**: Customer, Cleaner, and Admin roles
- **Profile Management**: Update personal information, profile pictures
- **Address Management**: Save and manage multiple addresses

### Cleaner Management
- **Onboarding Process**: Stepwise cleaner registration
- **Interview System**: Schedule and manage cleaner interviews
- **Document Submission**: Upload and review cleaner documentation
- **Status Tracking**: Track cleaner from registration to active status

### Reservation System
- **Booking Management**: Create, view, edit, and cancel reservations
- **Scheduling**: Select dates and times for cleaning services
- **Assignment**: Assign cleaners to reservations
- **Status Tracking**: Track reservation status (pending, confirmed, completed)

### Chat System
- **Direct Messaging**: Communication between customers and cleaners
- **Admin Support**: Chat with customer support
- **Chat History**: View and search message history
- **Notifications**: Get notified of new messages
- **Context-Aware Visibility**: Chats are visible based on cleaning dates (72 hours before and 48 hours after)

### Admin Dashboard
- **User Management**: View and manage all users
- **Cleaner Approval**: Review and approve cleaner applications
- **Reservation Management**: Monitor all bookings and their statuses
- **Analytics**: View insights about platform usage
- **Content Management**: Create and manage promotions, events, and notices
- **Shop Management**: Manage products in the shop

### Shop
- **Product Listing**: Browse products and services
- **Product Details**: View detailed information about products
- **Purchase Process**: Buy products through the platform

### Notification System
- **Real-time Notifications**: Get notified of important events
- **Email Notifications**: Receive email updates for critical actions

### Events and Promotions
- **Event Management**: Create and manage special events
- **Promotion System**: Create discounts and promotional campaigns
- **Rank System**: Loyalty program with user ranks and benefits

## Technical Implementation

### Frontend
- React with TypeScript
- React Router for navigation
- TanStack Query for data fetching and caching
- Context API for state management
- Tailwind CSS for styling
- UI component library with shadcn

### Backend
- Supabase for database and authentication
- Real-time subscriptions for chat and notifications
- Storage for user uploads and images

### State Management
- React Context for global state
- TanStack Query for server state
- Local state with React useState

### API Integration
- Supabase client for database operations
- REST API patterns for data fetching
- Real-time subscriptions for live updates

## Getting Started

To run the project locally:

1. Clone the repository
2. Install dependencies with `npm install`
3. Set up environment variables for Supabase connection
4. Run the development server with `npm run dev`

## Deployment

we currently deploying in lovable, and playstore.

ask Noe to add you on the repo for the webview wrapper if need. 


## Todo
Code reactoring 
Add Payment computation on Calendar page
Sending sms message.
UI changes.


