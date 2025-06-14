# Project Structure Rules

Code Organization:
Keep files focused and single-responsibility
Maximum file size of 300 lines (split if larger)
Group related functionality together
Use consistent naming conventions
Delete unused functions, variables, and imports.


Root Directory Organization (/src)
```text
src/
├── components/     # Reusable UI components
├── pages/         # Page components and routes
├── context/       # React context providers
├── hooks/         # Custom React hooks (reusable logic that involves state, side effects, data fetching, or business rules.)
├── models/        # Data models and database operations
├── utils/         # Utility functions and helpers
├── types/         # TypeScript type definitions
├── integrations/  # External service integrations
├── lib/          # Third-party library configurations
└── App.tsx       # Root application component
```

Components Directory Rules (/components)
```text
components/
├── ui/           # Basic UI components (buttons, inputs, etc.)
├── auth/         # Authentication-related components
├── layout/       # Layout components (headers, footers, etc.)
├── shared/       # Shared components used across multiple features
└── [feature]/    # Feature-specific components
```

Routing Rules:
```text
src/routes/       #The route of differencr pages 
```

Example Structure:

/src/routes/components
```typescript
  export const CleanerRegistrationRouteHandler = () => {
      console.log("CleanerRegistrationRouteHandler");
      return (
        <Routes>
          <Route index element={<InterviewSchedule />} />
          <Route path="schedule" element={<InterviewSchedule />} />
          <Route path="location" element={<InterviewSite />} />
          <Route path="details" element={<InterviewDetails />} />
          <Route path="complete" element={<InterviewComplete />} />
        </Routes>
      );
    };
```

Route Organization:
- Keep route handlers simple and focused on routing logic
- Use route handlers to determine which component to render
- Group related routes together in the same directory
- Use consistent naming: [Feature]RouteHandler.tsx for handlers
- Keep route components in their respective feature directories
- Use TypeScript for route parameters and return types

Route Handler Guidelines:
- Route handlers should be minimal and only handle routing decisions
- Use switch/case or if/else for route path matching
- Return components directly from route handlers
- Handle undefined or invalid routes gracefully
- Use proper TypeScript types for route parameters
- Keep route logic separate from component logic



Loading State Guidelines
- All loading states in the app must use the Shimmer effect instead of spinners;
- Use shimmer components that resemble the final layout (e.g., rectangular shimmer for cards, lines for text, etc.)
- Place shimmer components in the same location and layout as the content they replace.
- Avoid showing spinners unless specifically approved for rare cases (e.g., full-page blocking actions).

```typescript
const StoreItemSkeleton: React.FC = () => {
  return (
    <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-2">
      <Card className="overflow-hidden h-36 relative">
        <div className="h-full w-full p-4 flex flex-col justify-between">
          <div className="flex justify-between">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-6 w-6 rounded-full" />
          </div>
          <div className="mt-auto">
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
      </Card>
      <Skeleton className="h-4 w-16 mt-2 mx-auto" />
    </div>
  );
};
```



Type Safety:
Use TypeScript strictly
Define proper interfaces and types
Avoid using any type
Export types when needed by other modules

TanStack Query Guidelines:
1. Query Keys:
   - Use array-based query keys for better type safety
   - Group related queries with a common prefix
   - Example: ['wallet', 'balances'] for wallet balance queries

2. Query Functions:
   - Keep query functions in the models directory
   - Use TypeScript for proper typing of query parameters and responses
   - Example: getWalletBalances(userId: string): Promise<WalletBalances>

3. Mutations:
   - Use mutations for data modifications (create, update, delete)
   - Handle success/error cases with toast notifications
   - Invalidate related queries after successful mutations
   - Example: 
     ```typescript
     const { mutate } = useMutation({
       mutationFn: withdrawCash,
       onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['wallet', 'balances'] });
         toast.success('Withdrawal successful');
       }
     });
     ```

4. Custom Hooks:
   - Create custom hooks in the hooks directory for complex query logic
   - Include proper TypeScript types and error handling
   - Example: useWalletBalances(userId: string)

5. Error Handling:
   - Use try/catch blocks in query functions
   - Provide meaningful error messages
   - Handle errors consistently across the application

6. Query Configuration:
   - Set appropriate staleTime and cacheTime for queries
   - Use enabled option for conditional queries
   - Implement proper loading and error states in components

7. Best Practices:
   - Keep queries and mutations close to where they're used
   - Use queryClient.prefetchQuery for anticipated data needs
   - Implement proper loading and error states in components
   - Use select option to transform data when needed
   - Consider using suspense for better loading states

No UI Edits Without Approval:
Do not change UI files (visual elements, layout, styling) unless absolutely necessary to complete a logic or UX task.
Focus only on logic, UX, and functionality.

If UI Edit is Required:
Clearly explain why the change is necessary.
Specify which file(s) need to be edited.
Ask for approval before making any UI changes.







